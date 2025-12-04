import { Loading, LoadingSpinner, SkeletonCard, TableSkeleton } from '@/components/ui/loading';

// Example 1: Basic Loading Screen
function MyComponent() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loading />;
    }

    return <div>Content</div>;
}

// Example 2: Loading with Custom Text
function MyComponent2() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loading text="Loading your data..." />;
    }

    return <div>Content</div>;
}

// Example 3: Different Sizes
function MyComponent3() {
    return (
        <div>
            <Loading size="sm" />
            <Loading size="md" />  {/* default */}
            <Loading size="lg" />
            <Loading size="xl" />
        </div>
    );
}

// Example 4: Full Screen Loading
function MyComponent4() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loading fullScreen text="Please wait..." />;
    }

    return <div>Content</div>;
}

// Example 5: Inline Spinner (for buttons)
function MyButton() {
    const [submitting, setSubmitting] = useState(false);

    return (
        <button disabled={submitting}>
            {submitting && <LoadingSpinner className="mr-2" />}
            {submitting ? 'Submitting...' : 'Submit'}
        </button>
    );
}

// Example 6: Skeleton Loading
function MyCard() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <SkeletonCard />;
    }

    return <div>Card Content</div>;
}

// Example 7: Table Skeleton
function MyTable() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <TableSkeleton rows={5} columns={4} />;
    }

    return <table>...</table>;
}
