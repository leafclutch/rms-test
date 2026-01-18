import React from 'react';
import { Outlet} from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

export const AdminLayout: React.FC = () => {

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar/>

            {/* Main Content */}

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};