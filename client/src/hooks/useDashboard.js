import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { queryKeys, cacheConfig } from '../lib/queryClient';
import { useAuth } from './useAuth';

// Hook to get dashboard statistics
export const useDashboardStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.dashboardStats(),
        queryFn: dashboardService.getDashboardStats,
        ...cacheConfig.stats,
        enabled: !!user?.isAdmin, // Only fetch if user is admin
    });
};
