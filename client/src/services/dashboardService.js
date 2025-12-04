import { userService } from './userService';
import { postService } from './postService';
import { commentService } from './commentService';

// Dashboard service for aggregated statistics
export const dashboardService = {
    // Get all dashboard statistics
    getDashboardStats: async () => {
        try {
            // Fetch all data in parallel
            const [usersData, postsData, commentsData] = await Promise.all([
                userService.getUsers({ limit: 5 }),
                postService.getPosts({ limit: 5 }),
                commentService.getAllComments({ limit: 5 }),
            ]);

            return {
                users: usersData.users || [],
                totalUsers: usersData.totalUsers || 0,
                lastMonthUsers: usersData.lastMonthUsers || 0,

                posts: postsData.posts || [],
                totalPosts: postsData.totalPosts || 0,
                lastMonthPosts: postsData.lastMonthPosts || 0,

                comments: commentsData.comments || [],
                totalComments: commentsData.totalComments || 0,
                lastMonthComments: commentsData.lastMonthComments || 0,
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },
};
