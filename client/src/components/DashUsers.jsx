import { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
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

export default function DashUsers() {
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [startIndex, setStartIndex] = useState(0);

  // Fetch users with React Query
  const { data, isLoading, error } = useUsers({ startIndex, limit: 9 });
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = data?.users || [];
  const showMore = users.length >= 9;

  const handleShowMore = () => {
    setStartIndex(users.length);
  };

  const handleDeleteUser = () => {
    deleteUser(userIdToDelete, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  if (isLoading) {
    return <Loading text="Loading users..." />;
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="text-destructive">Error loading users: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-3">
      {users.length > 0 ? (
        <>
          <div className="rounded-md border shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date created</TableHead>
                  <TableHead>User image</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 object-cover bg-muted rounded-full"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaTimes className="text-destructive" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto">
              <HiOutlineExclamationCircle className="h-14 w-14 text-muted-foreground" />
            </div>
            <DialogTitle className="text-center">Delete User</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
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
