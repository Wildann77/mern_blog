import { useEffect, useState } from 'react';
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiDocument,
  HiOutlineUserGroup,
  HiUser,
} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    const res = await fetch('/api/user/signout', {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      console.log('Signout failed:', data.message);
    } else {
      dispatch(signoutSuccess());
    }
  };

  return (
    <Sidebar collapsible="none">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HiChartPie className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MERN Blog</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard - Admin Only */}
              {currentUser && currentUser.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={tab === 'dash' || !tab}>
                    <Link to="/dashboard?tab=dash">
                      <HiChartPie />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Profile */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={tab === 'profile' || (!tab && !currentUser?.isAdmin)}>
                  <Link to="/dashboard?tab=profile">
                    <HiUser />
                    <span>Profile</span>
                    {currentUser?.isAdmin && (
                      <Badge variant="secondary" className="ml-auto">
                        Admin
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* My Posts - All Users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={tab === 'myposts'}>
                  <Link to="/dashboard?tab=myposts">
                    <HiDocument />
                    <span>My Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Management Section */}
        {currentUser?.isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* All Posts */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={tab === 'posts'}>
                      <Link to="/dashboard?tab=posts">
                        <HiDocumentText />
                        <span>All Posts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Users */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={tab === 'users'}>
                      <Link to="/dashboard?tab=users">
                        <HiOutlineUserGroup />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Comments */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={tab === 'comments'}>
                      <Link to="/dashboard?tab=comments">
                        <HiAnnotation />
                        <span>Comments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          {/* User Info */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard?tab=profile">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.username} />
                  <AvatarFallback className="rounded-lg">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{currentUser?.username}</span>
                  <span className="truncate text-xs">{currentUser?.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Sign Out */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <HiArrowSmRight />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashSidebar;

