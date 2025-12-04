import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable Loading Component
 * @param {Object} props
 * @param {string} props.className - Additional classes for the container
 * @param {string} props.size - Size of the spinner: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.text - Optional loading text to display
 * @param {boolean} props.fullScreen - Whether to show full screen loading
 */
export function Loading({
    className,
    size = 'md',
    text,
    fullScreen = false
}) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const containerClasses = fullScreen
        ? 'fixed inset-0 flex flex-col justify-center items-center bg-background/80 backdrop-blur-sm z-50'
        : 'flex flex-col justify-center items-center min-h-[400px]';

    return (
        <div className={cn(containerClasses, className)}>
            <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
            {text && (
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

/**
 * Inline Loading Spinner (for buttons, etc.)
 */
export function LoadingSpinner({ className, size = 'sm' }) {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <Loader2 className={cn(sizeClasses[size], 'animate-spin', className)} />
    );
}

/**
 * Skeleton Loading Component for cards/content
 */
export function SkeletonCard({ className }) {
    return (
        <div className={cn('rounded-lg border bg-card p-6 space-y-3', className)}>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
        </div>
    );
}

/**
 * Table Skeleton Loading
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    {Array.from({ length: columns }).map((_, j) => (
                        <div
                            key={j}
                            className="h-12 bg-muted rounded animate-pulse flex-1"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
