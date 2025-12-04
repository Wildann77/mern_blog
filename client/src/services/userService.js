import api from '../lib/api';

// User service functions
export const userService = {
    // Get users with filters (admin only)
    getUsers: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/user/getusers?${queryString}` : '/user/getusers';

        const response = await api.get(url);
        return response.data;
    },

    // Get single user
    getUser: async (userId) => {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    },

    // Update user
    updateUser: async ({ userId, data }) => {
        const response = await api.put(`/user/update/${userId}`, data);
        return response.data;
    },

    // Delete user
    deleteUser: async (userId) => {
        const response = await api.delete(`/user/delete/${userId}`);
        return response.data;
    },
};
