import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout() {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Responsive role-based Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Responsive Top Navigation */}
                <TopNav />

                {/* Main scrollable panel */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}