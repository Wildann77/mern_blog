import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lens } from '@/components/ui/lens';

export default function PostCard({ post }) {
  return (
    <Card className="relative max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="p-0">
        <Lens isStatic position={{ x: 260, y: 150 }}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[260px] object-cover"
          />
        </Lens>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl line-clamp-2 mb-2">{post.title}</CardTitle>
        <CardDescription className="italic text-sm">
          {post.category}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/post/${post.slug}`} className="w-full">
          <Button className="w-full">Read article</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
