import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-3">
      {currentUser.isAdmin && comments.length > 0 ? (
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
                        className="font-medium text-red-500 hover:underline cursor-pointer"
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
              className="w-full text-teal-500 py-7"
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
            <Button variant="destructive" onClick={handleDeleteComment}>
              Yes, I'm sure
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
