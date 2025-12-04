import api from '../lib/api';

// Post service functions
export const postService = {
    // Get posts with filters
    getPosts: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

        const queryString = queryParams.toString();
        const url = queryString ? `/post/getposts?${queryString}` : '/post/getposts';

        const response = await api.get(url);
        return response.data;
    },

    // Get single post by slug
    getPost: async (slug) => {
        const response = await api.get(`/post/getposts?slug=${slug}`);
        return response.data;
    },

    // Get current user's posts
    getMyPosts: async (userId, params = {}) => {
        const queryParams = new URLSearchParams({ userId, ...params });
        const response = await api.get(`/post/getposts?${queryParams.toString()}`);
        return response.data;
    },

    // Create new post
    createPost: async (postData) => {
        const response = await api.post('/post/create', postData);
        return response.data;
    },

    // Update post
    updatePost: async ({ postId, userId, data }) => {
        const response = await api.put(`/post/updatepost/${postId}/${userId}`, data);
        return response.data;
    },

    // Delete post
    deletePost: async ({ postId, userId }) => {
        const response = await api.delete(`/post/deletepost/${postId}/${userId}`);
        return response.data;
    },
};
