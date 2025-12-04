import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { queryKeys, cacheConfig } from '../lib/queryClient';
import { useAuth } from './useAuth';

// Hook to get posts with filters
export const usePosts = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.postsList(filters),
        queryFn: () => postService.getPosts(filters),
        ...cacheConfig.posts,
        // Only enable if we have meaningful filters or want to fetch all posts
        enabled: true,
    });
};

// Hook to get single post by slug
export const usePost = (slug) => {
    return useQuery({
        queryKey: queryKeys.postsDetail(slug),
        queryFn: async () => {
            const data = await postService.getPost(slug);
            // API returns { posts: [...] }, we need the first post
            return data.posts && data.posts.length > 0 ? data.posts[0] : null;
        },
        ...cacheConfig.post,
        enabled: !!slug, // Only fetch if slug is provided
    });
};

// Hook to get current user's posts
export const useMyPosts = (params = {}) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.myPosts(user?._id),
        queryFn: () => postService.getMyPosts(user._id, params),
        ...cacheConfig.posts,
        enabled: !!user?._id, // Only fetch if user is authenticated
    });
};

// Hook to create post
export const useCreatePost = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.createPost,
        onSuccess: (data) => {
            // Invalidate posts queries to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.posts });

            // Navigate to the created post
            if (data.slug) {
                navigate(`/post/${data.slug}`);
            }
        },
        onError: (error) => {
            console.error('Create post error:', error);
        },
    });
};

// Hook to update post
export const useUpdatePost = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: ({ postId, data }) =>
            postService.updatePost({ postId, userId: user._id, data }),
        onSuccess: (data, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: queryKeys.posts });
            queryClient.invalidateQueries({
                queryKey: queryKeys.postsDetail(variables.data.slug || data.slug),
            });

            // Navigate to updated post
            if (data.slug) {
                navigate(`/post/${data.slug}`);
            }
        },
        onError: (error) => {
            console.error('Update post error:', error);
        },
    });
};

// Hook to delete post
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (postId) =>
            postService.deletePost({ postId, userId: user._id }),
        onSuccess: () => {
            // Invalidate posts queries to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.posts });
        },
        onError: (error) => {
            console.error('Delete post error:', error);
        },
    });
};
