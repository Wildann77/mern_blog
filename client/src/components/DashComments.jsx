import { useState } from 'react';
import { useAllComments, useDeleteComment } from '../hooks/useComments';
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

export default function DashComments() {
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [startIndex, setStartIndex] = useState(0);

  // Fetch comments with React Query
  const { data, isLoading, error } = useAllComments({ startIndex, limit: 9 });
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const comments = data?.comments || [];
  const showMore = comments.length >= 9;

  const handleShowMore = () => {
    setStartIndex(comments.length);
  };

  const handleDeleteComment = () => {
    deleteComment(commentIdToDelete, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  if (isLoading) {
    return <Loading text="Loading comments..." />;
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="text-destructive">Error loading comments: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-3">
      {comments.length > 0 ? (
        <>
          <div className="rounded-md border shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date updated</TableHead>
                  <TableHead>Comment content</TableHead>
                  <TableHead>Number of likes</TableHead>
                  <TableHead>PostId</TableHead>
                  <TableHead>UserId</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>{comment.userId}</TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="font-medium text-destructive hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {showMore && (
            <Button
              variant="link"
              onClick={handleShowMore}
              className="w-full text-primary py-7"
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto">
              <HiOutlineExclamationCircle className="h-14 w-14 text-muted-foreground" />
            </div>
            <DialogTitle className="text-center">Delete Comment</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this comment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="destructive" onClick={handleDeleteComment} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : "Yes, I'm sure"}
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
