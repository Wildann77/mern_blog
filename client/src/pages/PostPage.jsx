import { Link, useParams } from 'react-router-dom';
import { usePost, usePosts, useDeletePost } from '../hooks/usePosts';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Use React Query hooks
  const { data: post, isLoading, error } = usePost(postSlug);
  const { data: recentPostsData } = usePosts({ limit: 3 });
  const { mutate: deletePost } = useDeletePost();

  const recentPosts = recentPostsData?.posts || [];

  const handleDeletePost = () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    deletePost(post._id);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-destructive">Post not found</p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Badge variant="secondary" className="px-4 py-2 rounded-full">
          {post.category}
        </Badge>
      </Link>
      <img
        src={post.image}
        alt={post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover rounded-lg"
      />
      <div className="flex justify-between p-3 border-b border-border mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* Edit/Delete Buttons */}
      {currentUser && (currentUser._id === post.userId || currentUser.isAdmin) && (
        <div className="flex gap-4 justify-center my-5 max-w-2xl mx-auto">
          <Link to={`/update-post/${post._id}`}>
            <Button>Edit Post</Button>
          </Link>
          <Button variant="destructive" onClick={handleDeletePost}>
            Delete Post
          </Button>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col w-full items-center justify-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 max-w-6xl mx-auto">
          {recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
