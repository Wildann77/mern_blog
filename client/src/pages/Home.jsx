import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { usePosts } from '../hooks/usePosts';

export default function Home() {
  const { data: postsData } = usePosts();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      {/* Hero Section with Gradient Background */}
      <div className="bg-background relative w-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="from-primary/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
          <div className="bg-primary/5 absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-15"></div>

        <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 flex justify-center">
              <div className="border-border bg-background/80 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
                <span className="bg-primary mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
                <span className="text-muted-foreground">
                  Discover articles, tutorials, and tech insights
                </span>
                <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to My Blog
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg">
              Explore a wide range of articles, tutorials, and resources designed to help you grow as a developer.
              From web development to software engineering best practices, there's something here for everyone.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/search">
                <Button
                  size="lg"
                  className="group bg-primary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden rounded-full px-6 shadow-lg transition-all duration-300">
                  <span className="relative z-10 flex items-center">
                    View All Posts
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="from-primary via-primary/90 to-primary/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </Button>
              </Link>

              {currentUser && (
                <Link to="/create-post">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-border bg-background/50 flex items-center gap-2 rounded-full backdrop-blur-sm">
                    <PenSquare className="h-4 w-4" />
                    Create Post
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-12">
        {postsData?.posts && postsData.posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center">
              Recent Posts
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {postsData.posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
            <Link
              to={'/search'}
              className="text-lg text-primary hover:underline text-center font-semibold">
              View all posts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
