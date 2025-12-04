import { signoutSuccess } from '../redux/user/userSlice';

// Function to handle API fetch with automatic token validation
export const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Always include cookies
        });

        // If unauthorized (token expired or invalid), logout user
        if (response.status === 401) {
            // Get store instance
            const { store } = await import('../redux/store');

            // Dispatch logout action
            store.dispatch(signoutSuccess());

            // Redirect to sign-in page
            window.location.href = '/sign-in';

            throw new Error('Session expired. Please login again.');
        }

        return response;
    } catch (error) {
        throw error;
    }
};

// Function to validate current session
export const validateSession = async () => {
    try {
        const response = await fetch('/api/auth/validate-session', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.valid === true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
};
