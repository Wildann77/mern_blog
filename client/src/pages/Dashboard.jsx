import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className="">{tab === 'profile' && <DashProfile />}</div>
      {/* posts */}
      <div className="">{tab === 'posts' && <DashPosts />}</div>
      {/* users */}
      <div className="">{tab === 'users' && <DashUsers />}</div>
      {/* comments */}
      <div className="">{tab === 'comments' && <DashComments />}</div>
      {/* dash comp */}
      <div className=""> {tab === 'dash' && <DashboardComp />}</div>
    </div>
  );
};

export default Dashboard;
