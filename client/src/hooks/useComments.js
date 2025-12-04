import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import { queryKeys, cacheConfig } from '../lib/queryClient';

// Hook to get comments for a post
export const useComments = (postId) => {
    return useQuery({
        queryKey: queryKeys.commentsList(postId),
        queryFn: () => commentService.getComments(postId),
        ...cacheConfig.comments,
        enabled: !!postId, // Only fetch if postId is provided
    });
};

// Hook to get all comments (admin)
export const useAllComments = (params = {}) => {
    return useQuery({
        queryKey: ['comments', 'all', params],
        queryFn: () => commentService.getAllComments(params),
        ...cacheConfig.comments,
    });
};

// Hook to create comment
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onMutate: async (newComment) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: queryKeys.commentsList(newComment.postId),
            });

            // Snapshot previous value
            const previousComments = queryClient.getQueryData(
                queryKeys.commentsList(newComment.postId)
            );

            // Optimistically update cache
            queryClient.setQueryData(
                queryKeys.commentsList(newComment.postId),
                (old) => {
                    if (!old) return old;
                    return [...(old || []), { ...newComment, _id: 'temp-id' }];
                }
            );

            return { previousComments };
        },
        onError: (error, newComment, context) => {
            // Rollback on error
            queryClient.setQueryData(
                queryKeys.commentsList(newComment.postId),
                context.previousComments
            );
            console.error('Create comment error:', error);
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: queryKeys.commentsList(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: ['comments', 'all'] });
        },
    });
};

// Hook to delete comment
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.deleteComment,
        onSuccess: () => {
            // Invalidate all comment queries
            queryClient.invalidateQueries({ queryKey: queryKeys.comments });
            queryClient.invalidateQueries({ queryKey: ['comments', 'all'] });
        },
        onError: (error) => {
            console.error('Delete comment error:', error);
        },
    });
};

// Hook to like comment
export const useLikeComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.likeComment,
        onSuccess: (data, commentId) => {
            // Invalidate comment queries to refetch updated like count
            queryClient.invalidateQueries({ queryKey: queryKeys.comments });
        },
        onError: (error) => {
            console.error('Like comment error:', error);
        },
    });
};

// Hook to edit comment
export const useEditComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.editComment,
        onSuccess: () => {
            // Invalidate comment queries
            queryClient.invalidateQueries({ queryKey: queryKeys.comments });
        },
        onError: (error) => {
            console.error('Edit comment error:', error);
        },
    });
};
