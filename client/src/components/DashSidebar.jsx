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
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    console.log(tabFromUrl);
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

  const NavItem = ({ to, icon: Icon, label, badge, active }) => (
    <Link to={to}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${active
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent hover:text-accent-foreground'
          }`}
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1">{label}</span>
        {badge && (
          <Badge variant={active ? 'secondary' : 'outline'} className="ml-auto">
            {badge}
          </Badge>
        )}
      </div>
    </Link>
  );

  return (
    <aside className="w-full md:w-56 bg-background border-r">
      <nav className="flex flex-col gap-1 p-4">
        {currentUser && currentUser.isAdmin && (
          <NavItem
            to="/dashboard?tab=dash"
            icon={HiChartPie}
            label="Dashboard"
            active={tab === 'dash' || !tab}
          />
        )}

        <NavItem
          to="?tab=profile"
          icon={HiUser}
          label="Profile"
          badge={currentUser?.isAdmin ? 'Admin' : 'User'}
          active={tab === 'profile'}
        />

        {/* My Posts - for all users */}
        <NavItem
          to="?tab=myposts"
          icon={HiDocument}
          label="My Posts"
          active={tab === 'myposts'}
        />

        {/* All Posts - admin only */}
        {currentUser?.isAdmin && (
          <NavItem
            to="?tab=posts"
            icon={HiDocumentText}
            label="All Posts"
            active={tab === 'posts'}
          />
        )}

        {currentUser.isAdmin && (
          <>
            <NavItem
              to="/dashboard?tab=users"
              icon={HiOutlineUserGroup}
              label="Users"
              active={tab === 'users'}
            />
            <NavItem
              to="/dashboard?tab=comments"
              icon={HiAnnotation}
              label="Comments"
              active={tab === 'comments'}
            />
          </>
        )}

        <div
          onClick={handleSignout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:bg-destructive/10 hover:text-destructive"
        >
          <HiArrowSmRight className="h-5 w-5" />
          <span>Sign Out</span>
        </div>
      </nav>
    </aside>
  );
};

export default DashSidebar;
