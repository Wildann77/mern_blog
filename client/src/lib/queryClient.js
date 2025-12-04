import { QueryClient } from '@tanstack/react-query';

// Query keys factory for consistent cache management
export const queryKeys = {
    // Auth
    auth: ['auth'],
    currentUser: () => [...queryKeys.auth, 'current'],

    // Posts
    posts: ['posts'],
    postsList: (filters) => [...queryKeys.posts, 'list', filters],
    postsDetail: (slug) => [...queryKeys.posts, 'detail', slug],
    myPosts: (userId) => [...queryKeys.posts, 'my', userId],

    // Users
    users: ['users'],
    usersList: (filters) => [...queryKeys.users, 'list', filters],
    usersDetail: (userId) => [...queryKeys.users, 'detail', userId],

    // Comments
    comments: ['comments'],
    commentsList: (postId) => [...queryKeys.comments, 'list', postId],

    // Dashboard
    dashboard: ['dashboard'],
    dashboardStats: () => [...queryKeys.dashboard, 'stats'],
};

// Caching configuration based on requirements
export const cacheConfig = {
    posts: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    post: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        cacheTime: 15 * 60 * 1000, // 15 minutes
    },
    user: {
        staleTime: 15 * 60 * 1000, // 15 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
    },
    stats: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        cacheTime: 5 * 60 * 1000, // 5 minutes
    },
    comments: {
        staleTime: 3 * 60 * 1000, // 3 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    },
};

// Create and configure QueryClient
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Default caching behavior
            staleTime: 5 * 60 * 1000, // 5 minutes default
            cacheTime: 10 * 60 * 1000, // 10 minutes default

            // Refetch behavior
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,

            // Retry configuration
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Error handling
            useErrorBoundary: false,
        },
        mutations: {
            // Mutation error handling
            useErrorBoundary: false,
            retry: false,
        },
    },
});
