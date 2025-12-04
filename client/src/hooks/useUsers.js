import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { queryKeys, cacheConfig } from '../lib/queryClient';
import { useAuth } from './useAuth';

// Hook to get users with filters (admin only)
export const useUsers = (filters = {}) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.usersList(filters),
        queryFn: () => userService.getUsers(filters),
        ...cacheConfig.user,
        enabled: !!user?.isAdmin, // Only fetch if user is admin
    });
};

// Hook to get single user
export const useUser = (userId) => {
    return useQuery({
        queryKey: queryKeys.usersDetail(userId),
        queryFn: () => userService.getUser(userId),
        ...cacheConfig.user,
        enabled: !!userId,
    });
};

// Hook to update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { user, updateUser } = useAuth();

    return useMutation({
        mutationFn: (data) =>
            userService.updateUser({ userId: user._id, data }),
        onSuccess: (data) => {
            // Update auth context with new user data
            updateUser(data);

            // Invalidate user queries
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
            queryClient.invalidateQueries({
                queryKey: queryKeys.usersDetail(user._id),
            });
        },
        onError: (error) => {
            console.error('Update user error:', error);
        },
    });
};

// Hook to delete user (admin or self)
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    return useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: (data, userId) => {
            // If deleting self, logout
            // Otherwise just invalidate queries (admin deleting other user)
            queryClient.invalidateQueries({ queryKey: queryKeys.users });

            // If the deleted user is the current user, logout
            // This check should be done in the component calling this hook
        },
        onError: (error) => {
            console.error('Delete user error:', error);
        },
    });
};
