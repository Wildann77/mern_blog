import axios from 'axios';
import { store } from '../redux/store';
import { signoutSuccess } from '../redux/user/userSlice';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

// Request interceptor - attach token from Redux store
api.interceptors.request.use(
    (config) => {
        // Get current state from Redux store
        const state = store.getState();
        const currentUser = state.user.currentUser;

        // If user is authenticated, we rely on httpOnly cookies
        // No need to manually attach token as it's handled by cookies
        // This interceptor can be used for other request modifications if needed

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and auto-logout on 401
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Dispatch logout action
            store.dispatch(signoutSuccess());

            // Redirect to sign-in page
            window.location.href = '/sign-in';

            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle other errors
        if (error.response?.data?.message) {
            return Promise.reject(new Error(error.response.data.message));
        }

        return Promise.reject(error);
    }
);

export default api;
