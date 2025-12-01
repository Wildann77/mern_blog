import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.image) {
      setPublishError('Please fill all fields and upload an image');
      return;
    }

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || 'Post creation failed');
        return;
      }

      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={handleImageChange} />
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline disabled={uploading}>
            {uploadProgress ? (
              <div className='w-16 h-16'>
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
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}

        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          disabled={uploading}
        >
          Publish
        </Button>

        {publishError && (
          <Alert color='failure' className='mt-5'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
