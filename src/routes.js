import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import ClientLayout from './layouts/ClientLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import UserManager from './pages/admin/UserManager';

export const publicRoutes = [
  // auth
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },

  // web
  { path: '/', component: Home, layout: ClientLayout },
];

export const privateRoutes = [
  // admin
  { path: '/quan-tri/nguoi-dung', component: UserManager, layout: AdminLayout },
  { path: '/quan-tri', component: Dashboard, layout: AdminLayout },
];
