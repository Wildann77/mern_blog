import api from '../lib/api';

// Comment service functions
export const commentService = {
    // Get comments for a post
    getComments: async (postId) => {
        const response = await api.get(`/comment/getPostComments/${postId}`);
        return response.data;
    },

    // Get all comments (admin)
    getAllComments: async (params = {}) => {
        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString();
        const url = queryString ? `/comment/getcomments?${queryString}` : '/comment/getcomments';

        const response = await api.get(url);
        return response.data;
    },

    // Create comment
    createComment: async (commentData) => {
        const response = await api.post('/comment/create', commentData);
        return response.data;
    },

    // Delete comment
    deleteComment: async (commentId) => {
        const response = await api.delete(`/comment/deleteComment/${commentId}`);
        return response.data;
    },

    // Like comment
    likeComment: async (commentId) => {
        const response = await api.put(`/comment/likeComment/${commentId}`);
        return response.data;
    },

    // Edit comment
    editComment: async ({ commentId, content }) => {
        const response = await api.put(`/comment/editComment/${commentId}`, { content });
        return response.data;
    },
};
