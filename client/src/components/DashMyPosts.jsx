import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyPosts, useDeletePost } from '../hooks/usePosts';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loading } from '@/components/ui/loading';

export default function DashMyPosts() {
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [startIndex, setStartIndex] = useState(0);

    // Use React Query hooks
    const { data, isLoading, error } = useMyPosts({ startIndex, limit: 9 });
    const { mutate: deletePost, isPending: isDeleting, error: deleteError } = useDeletePost();

    const userPosts = data?.posts || [];
    const stats = {
        totalPosts: data?.totalPosts || 0,
        lastMonthPosts: data?.lastMonthPosts || 0,
    };
    const showMore = userPosts.length >= 9;

    const handleShowMore = () => {
        setStartIndex(userPosts.length);
    };

    const handleDeletePost = () => {
        deletePost(postIdToDelete, {
            onSuccess: () => {
                setShowModal(false);
            },
        });
    };

    if (isLoading) {
        return <Loading text="Loading your posts..." />;
    }

    if (error) {
        return (
            <div className='p-3'>
                <Alert variant='destructive'>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className='overflow-x-auto p-3'>
            {/* Stats Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='border rounded-lg p-4'>
                    <h3 className='text-sm font-medium text-muted-foreground'>Total Posts</h3>
                    <p className='text-2xl font-bold mt-2'>{stats.totalPosts}</p>
                </div>
                <div className='border rounded-lg p-4'>
                    <h3 className='text-sm font-medium text-muted-foreground'>Last Month</h3>
                    <p className='text-2xl font-bold mt-2'>{stats.lastMonthPosts}</p>
                </div>
            </div>

            {/* Delete Error Alert */}
            {deleteError && (
                <Alert variant='destructive' className='mb-4'>
                    <AlertDescription>{deleteError.message}</AlertDescription>
                </Alert>
            )}

            {userPosts.length > 0 ? (
                <>
                    <div className='rounded-md border shadow-md'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date updated</TableHead>
                                    <TableHead>Post image</TableHead>
                                    <TableHead>Post title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Delete</TableHead>
                                    <TableHead>Edit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userPosts.map((post) => (
                                    <TableRow key={post._id}>
                                        <TableCell>
                                            {new Date(post.updatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/post/${post.slug}`}>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className='w-20 h-10 object-cover bg-muted rounded'
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                className='font-medium hover:underline'
                                                to={`/post/${post.slug}`}
                                            >
                                                {post.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setPostIdToDelete(post._id);
                                                }}
                                                className='font-medium text-destructive hover:underline cursor-pointer'
                                            >
                                                Delete
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                className='text-primary hover:underline'
                                                to={`/update-post/${post._id}`}
                                            >
                                                Edit
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {showMore && (
                        <Button
                            variant='link'
                            onClick={handleShowMore}
                            className='w-full text-primary py-7'
                        >
                            Show more
                        </Button>
                    )}
                </>
            ) : (
                <div className='text-center py-10'>
                    <p className='text-muted-foreground mb-4'>You have no posts yet!</p>
                    <Link to='/create-post'>
                        <Button>Create Your First Post</Button>
                    </Link>
                </div>
            )}

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <div className='mx-auto'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-muted-foreground' />
                        </div>
                        <DialogTitle className='text-center'>Delete Post</DialogTitle>
                        <DialogDescription className='text-center'>
                            Are you sure you want to delete this post?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='flex gap-2 sm:justify-center'>
                        <Button variant='destructive' onClick={handleDeletePost} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : "Yes, I'm sure"}
                        </Button>
                        <Button variant='outline' onClick={() => setShowModal(false)}>
                            No, cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
