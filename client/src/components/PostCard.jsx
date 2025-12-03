import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='w-full max-w-[430px] border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full object-cover'
        />
      </Link>
      <div className='p-4 flex flex-col gap-2 flex-grow'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm text-muted-foreground'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-center py-2 rounded-md mt-auto'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
