import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';

// Customer Pages
import { OrderSuccess } from '../pages/customer/OrderSuccess';
import AdminDashboardView from '../pages/admin/AdminDashboardView';
import AdminOrdersView from '../pages/admin/AdminOrdersView';
import CreditLedger from '../pages/admin/CreditLedger';
import InventoryManagement from '../pages/admin/InventoryManagement';
import AdminLoginView from '../pages/admin/AdminLoginView';
import { ProtectedRoute } from '../layouts/ProtectedRoute';
import AdminMenuView from '../pages/admin/AdminMenuView';
import AdminWalkInCustomer from '../components/admin/AdminWalkInCustomer';
import WalkInOrder from '../components/admin/WalkInOrder';
import CustomerMenuView from '../pages/customer/CustomerMenuView';
import OrderTracking from '../pages/customer/OrderTracking';
import AdminAddMenuView from '../pages/admin/AdminAddMenuView';
import GenerateQr from '../pages/admin/GenerateQr';
import CustomerDetails from '../pages/admin/CustomerDetails';
import LandingPage from '../pages/LandingPage';
import ReportsView from '../pages/admin/ReportsView';
import AdminCreateOrderView from '../pages/admin/AdminCreateOrderView';

// Admin Pages
import OnlineEntry from '../pages/customer/OnlineEntry';

export const router = createBrowserRouter([
  // Landing Page - Redirect to /admin/login instead of rendering login directly
  {
    path: '/',
    element: <Navigate to="/admin/login" replace />
  },
  // Online Entry
  {
    path: '/Online',
    element: <OnlineEntry />
  },
  // Customer Routes
  {
    path: '/menu',
    element: <CustomerMenuView />
  },
  {
    path: '/menu/:tableId',
    element: <CustomerMenuView />
  },
  {
    path: '/order-success/:orderId',
    element: <OrderSuccess />
  },
  {
    path: '/order-tracking/:orderId',
    element: <OrderTracking />
  },

  // Admin Login (Public)
  {
    path: '/admin/login',
    element: <AdminLoginView />
  },

  // Admin Routes (Protected)
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboardView />
      },
      {
        path: 'menu',
        element: <AdminMenuView />
      },
      {
        path: 'menu/add',
        element: <AdminAddMenuView />
      },
      {
        path: 'walk-in-order',
        element: <WalkInOrder />
      },
      {
        path: 'orders',
        element: <AdminOrdersView />
      },
      {
        path: 'customers/:id',
        element: <CustomerDetails />
      },
      {
        path: 'generate-qr',
        element: <GenerateQr />
      },
      {
        path: 'walk-in-customer',
        element: <AdminWalkInCustomer />
      },
      {
        path: 'inventory',
        element: <InventoryManagement />
      },
      {
        path: 'credit',
        element: <CreditLedger />
      },
      {
        path: 'reports',
        element: <ReportsView />
      },
      {
        path: 'create-order',
        element: <AdminCreateOrderView />
      }
    ]
  },

  // 404 - Catch all
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);