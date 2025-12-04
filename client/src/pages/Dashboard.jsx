import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
import DashMyPosts from '../components/DashMyPosts';

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <SidebarProvider>
            <div className='min-h-screen flex w-full'>
                {/* Sidebar with Shadcn UI */}
                <DashSidebar />

                {/* Main Content Area */}
                <SidebarInset className='flex-1'>
                    <div className='flex flex-col min-h-screen'>
                        {/* Profile */}
                        {tab === 'profile' && <DashProfile />}

                        {/* Dashboard (Admin only) */}
                        {tab === 'dash' && <DashboardComp />}

                        {/* My Posts (All users) */}
                        {tab === 'myposts' && <DashMyPosts />}

                        {/* All Posts (Admin only) */}
                        {tab === 'posts' && <DashPosts />}

                        {/* Users (Admin only) */}
                        {tab === 'users' && <DashUsers />}

                        {/* Comments (Admin only) */}
                        {tab === 'comments' && <DashComments />}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
