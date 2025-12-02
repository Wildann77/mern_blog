import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageFileUploadError('Image must be less than 2MB');
        return;
      }
      setImageFileUploadError(null);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!imageFile) return;

    async function uploadImageToSupabase() {
      setUploading(true);
      setUploadProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress((prev) => (prev < 95 ? prev + 5 : prev));
      }, 200);

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, imageFile);

      clearInterval(interval);

      if (error) {
        setImageFileUploadError('Upload failed: ' + error.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      console.log('Profile Picture:', currentUser?.profilePicture);

      if (publicUrlData?.publicUrl) {
        setImageFileUrl(publicUrlData.publicUrl);
        setFormData((prev) => ({
          ...prev,
          profilePicture: publicUrlData.publicUrl,
        }));
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1000);
      }

      setUploading(false);
    }

    uploadImageToSupabase();
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (uploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    const res = await fetch('/api/user/signout', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      console.log('Signout failed:', data.message);
    } else {
      dispatch(signoutSuccess());
    }
  };

  console.log(currentUser, 'coba');

  return (
    <div className="max-w-lg mx-auto w-full p-4 md:p-8">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {uploadProgress && (
            <CircularProgressbar
              value={uploadProgress}
              text={`${uploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${uploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile"
            className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${uploadProgress && uploadProgress < 100
              ? 'opacity-30 transition-opacity duration-300 ease-in-out'
              : ''
              }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert variant="destructive">
            <AlertDescription>{imageFileUploadError}</AlertDescription>
          </Alert>
        )}

        <Input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <Input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          variant="outline"
          disabled={loading || uploading}
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </Button>

        <Link to={'/create-post'}>
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            variant="outline"
          >
            Create a post
          </Button>
        </Link>
      </form>

      <div className="text-red-500 flex justify-between mt-5 cursor-pointer">
        <span onClick={() => setShowModal(true)}>Delete Account</span>
        <span onClick={handleSignout}>Sign Out</span>
      </div>

      {updateUserSuccess && (
        <Alert className="mt-5">
          <AlertDescription>{updateUserSuccess}</AlertDescription>
        </Alert>
      )}
      {updateUserError && (
        <Alert variant="destructive" className="mt-5">
          <AlertDescription>{updateUserError}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mt-5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto">
              <HiOutlineExclamationCircle className="h-14 w-14 text-muted-foreground" />
            </div>
            <DialogTitle className="text-center">Delete Account</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="destructive" onClick={handleDeleteUser}>
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
};

export default DashProfile;
