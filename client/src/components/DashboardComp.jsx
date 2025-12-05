import { useDashboardStats } from '../hooks/useDashboard';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

export default function DashboardComp() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <Loading text="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <div className='p-4 md:p-6 lg:p-8'>
        <div className='text-center text-destructive'>
          Error loading dashboard: {error.message}
        </div>
      </div>
    );
  }

  const {
    users = [],
    totalUsers = 0,
    lastMonthUsers = 0,
    posts = [],
    totalPosts = 0,
    lastMonthPosts = 0,
    comments = [],
    totalComments = 0,
    lastMonthComments = 0,
  } = stats || {};

  return (
    <div className='p-4 md:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground mt-2'>
            Welcome back! Here's what's happening with your blog today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Total Users Card */}
          <Card className='overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Users
                  </p>
                  <p className='text-3xl font-bold'>{totalUsers}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center'>
                  <HiOutlineUserGroup className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2 text-sm'>
                <span className='flex items-center text-green-600 dark:text-green-400 font-medium'>
                  <HiArrowNarrowUp className='h-4 w-4' />
                  {lastMonthUsers}
                </span>
                <span className='text-muted-foreground'>from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Comments Card */}
          <Card className='overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Comments
                  </p>
                  <p className='text-3xl font-bold'>{totalComments}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center'>
                  <HiAnnotation className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2 text-sm'>
                <span className='flex items-center text-green-600 dark:text-green-400 font-medium'>
                  <HiArrowNarrowUp className='h-4 w-4' />
                  {lastMonthComments}
                </span>
                <span className='text-muted-foreground'>from last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Posts Card */}
          <Card className='overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Posts
                  </p>
                  <p className='text-3xl font-bold'>{totalPosts}</p>
                </div>
                <div className='h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center'>
                  <HiDocumentText className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
              </div>
              <div className='mt-4 flex items-center gap-2 text-sm'>
                <span className='flex items-center text-green-600 dark:text-green-400 font-medium'>
                  <HiArrowNarrowUp className='h-4 w-4' />
                  {lastMonthPosts}
                </span>
                <span className='text-muted-foreground'>from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Recent Users */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-lg font-semibold'>Recent Users</CardTitle>
              <Button variant='outline' size='sm' asChild>
                <Link to={'/dashboard?tab=users'}>See all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Image</TableHead>
                      <TableHead>Username</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <img
                              src={user.profilePicture}
                              alt='user'
                              className='w-10 h-10 rounded-full bg-muted object-cover'
                            />
                          </TableCell>
                          <TableCell className='font-medium'>{user.username}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className='text-center text-muted-foreground'>
                          No users yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-lg font-semibold'>Recent Comments</CardTitle>
              <Button variant='outline' size='sm' asChild>
                <Link to={'/dashboard?tab=comments'}>See all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comment Content</TableHead>
                      <TableHead>Likes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments && comments.length > 0 ? (
                      comments.map((comment) => (
                        <TableRow key={comment._id}>
                          <TableCell className='max-w-xs'>
                            <p className='line-clamp-2 text-sm'>{comment.content}</p>
                          </TableCell>
                          <TableCell className='font-medium'>{comment.numberOfLikes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className='text-center text-muted-foreground'>
                          No comments yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts - Full Width */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-lg font-semibold'>Recent Posts</CardTitle>
            <Button variant='outline' size='sm' asChild>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Image</TableHead>
                    <TableHead>Post Title</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>
                          <img
                            src={post.image}
                            alt='post'
                            className='w-20 h-12 rounded-md bg-muted object-cover'
                          />
                        </TableCell>
                        <TableCell className='font-medium max-w-md'>
                          <Link
                            to={`/post/${post.slug}`}
                            className='hover:underline'
                          >
                            {post.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary'>
                            {post.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className='text-center text-muted-foreground'>
                        No posts yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}