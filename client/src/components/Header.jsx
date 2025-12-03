import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className='border-b sticky top-0 bg-background z-50'>
      <nav className='max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between'>
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'
        >
          <span className='px-2 py-1 bg-primary text-primary-foreground rounded-lg'>
            Bangboy's's
          </span>
          {' '}Blog
        </Link>

        <form onSubmit={handleSubmit} className='hidden lg:block'>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Search...'
              className='w-64 pr-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AiOutlineSearch className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
          </div>
        </form>

        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={() => navigate('/search')}
        >
          <AiOutlineSearch className='h-5 w-5' />
        </Button>

        <div className='flex gap-2 md:order-2 items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='hidden sm:inline-flex'
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaSun className='h-5 w-5' /> : <FaMoon className='h-5 w-5' />}
          </Button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='rounded-full h-10 w-10 p-0 outline-none border-none bg-transparent hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center'>
                <Avatar>
                  <AvatarImage src={currentUser.profilePicture} alt={currentUser.username} />
                  <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium'>@{currentUser.username}</p>
                    <p className='text-xs text-muted-foreground truncate'>{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to='/dashboard' className='cursor-pointer'>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/dashboard?tab=profile' className='cursor-pointer'>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/create-post' className='cursor-pointer'>
                    Create Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/dashboard?tab=myposts' className='cursor-pointer'>
                    My Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout} className='cursor-pointer'>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to='/sign-in'>
              <Button>
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className='flex flex-col gap-4 mt-8'>
                <Link
                  to='/'
                  className={`text-lg font-medium transition-colors hover:text-primary ${path === '/' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  Home
                </Link>
                <Link
                  to='/about'
                  className={`text-lg font-medium transition-colors hover:text-primary ${path === '/about' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  About
                </Link>
                <Link
                  to='/projects'
                  className={`text-lg font-medium transition-colors hover:text-primary ${path === '/projects' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  Projects
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-8'>
          <Link
            to='/'
            className={`font-medium transition-colors hover:text-primary ${path === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Home
          </Link>
          <Link
            to='/about'
            className={`font-medium transition-colors hover:text-primary ${path === '/about' ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            About
          </Link>
          <Link
            to='/projects'
            className={`font-medium transition-colors hover:text-primary ${path === '/projects' ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Projects
          </Link>
        </div>
      </nav>
    </header>
  );
}