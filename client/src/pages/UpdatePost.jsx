import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { usePost, useUpdatePost } from '../hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loading } from '@/components/ui/loading';

export default function UpdatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const { postId } = useParams();

  // Use React Query hooks
  const { data: post, isLoading, error: fetchError } = usePost(postId);
  const { mutate: updatePost, isPending, error: updateError } = useUpdatePost();

  // Initialize form data when post is loaded
  useEffect(() => {
    if (post) {
      setFormData(post);
      setImageFileUrl(post.image || null);
    }
  }, [post]);

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

    const uploadImageToSupabase = async () => {
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
        .from('post-images')
        .upload(filePath, imageFile);

      clearInterval(interval);

      if (error) {
        setImageFileUploadError('Upload failed: ' + error.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setImageFileUrl(publicUrlData.publicUrl);
        setFormData((prev) => ({
          ...prev,
          image: publicUrlData.publicUrl,
        }));
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1000);
      }

      setUploading(false);
    };

    uploadImageToSupabase();
  }, [imageFile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData._id) {
      return;
    }

    const strippedContent = formData.content?.replace(/<(.|\n)*?>/g, '').trim();

    if (!formData.title || !strippedContent || !formData.image) {
      return;
    }

    updatePost({
      postId: formData._id,
      data: formData
    });
  };

  if (isLoading) {
    return <Loading text="Loading post..." />;
  }

  if (fetchError) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>Error loading post: {fetchError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={formData.title || ''}
          />
          <Select
            value={formData.category || 'uncategorized'}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="reactjs">React.js</SelectItem>
              <SelectItem value="nextjs">Next.js</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-dashed p-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
          >
            {uploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>

        {imageFileUploadError && (
          <Alert variant="destructive">
            <AlertDescription>{imageFileUploadError}</AlertDescription>
          </Alert>
        )}

        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="upload"
            className="w-full h-72 object-cover rounded-md"
          />
        )}

        <ReactQuill
          theme="snow"
          value={formData.content || ''}
          placeholder="Write something..."
          className="w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] mb-12"
          style={{ width: '100%' }}
          required
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
        />

        <Button
          type="submit"
          disabled={uploading || isPending}
        >
          {isPending ? 'Updating...' : 'Update Post'}
        </Button>

        {updateError && (
          <Alert variant="destructive" className="mt-5">
            <AlertDescription>{updateError.message}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
