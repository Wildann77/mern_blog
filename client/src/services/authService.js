import api from '../lib/api';

// Authentication service functions
export const authService = {
    // Login user
    loginUser: async (credentials) => {
        const response = await api.post('/auth/signin', credentials);
        return response.data;
    },

    // Register user
    registerUser: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // Google OAuth
    googleAuth: async (googleData) => {
        const response = await api.post('/auth/google', googleData);
        return response.data;
    },

    // Logout user
    logoutUser: async () => {
        const response = await api.post('/auth/signout');
        return response.data;
    },

    // Validate session
    validateSession: async () => {
        const response = await api.get('/auth/validate-session');
        return response.data;
    },
};
