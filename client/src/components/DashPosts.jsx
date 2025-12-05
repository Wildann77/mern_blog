import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts, useDeletePost } from '../hooks/usePosts';
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
import { Loading } from '@/components/ui/loading';

export default function DashPosts() {
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [startIndex, setStartIndex] = useState(0);

  // Use React Query hooks
  const { data, isLoading } = usePosts({ startIndex, limit: 9 });
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const userPosts = data?.posts || [];
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
    return <Loading text="Loading posts..." />;
  }

  return (
    <div className='overflow-x-auto p-3'>
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
        <p>No posts yet!</p>
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