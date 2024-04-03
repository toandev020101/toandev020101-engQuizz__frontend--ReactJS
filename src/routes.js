import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import ClientLayout from './layouts/ClientLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import UserManager from './pages/admin/UserManager';
import VerifyEmail from './pages/auth/VerifyEmail';
import AddOrEditUser from './pages/admin/UserManager/AddOrEditUser';
import QuestionManager from './pages/admin/OnlineExamManager/QuestionManager';
import AddOrEditQuestion from './pages/admin/OnlineExamManager/QuestionManager/AddOrEditQuestion';
import ImportQuestion from './pages/admin/OnlineExamManager/QuestionManager/ImportQuestion';

export const publicRoutes = [
  // auth
  { path: '/xac-minh-email', component: VerifyEmail, layout: AuthLayout },
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },

  // web
  { path: '/', component: Home, layout: ClientLayout },
];

export const privateRoutes = [
  // admin
  {
    path: '/quan-tri/thi-truc-tuyen/cau-hoi/chinh-sua/:id',
    component: AddOrEditQuestion,
    layout: AdminLayout,
  },
  {
    path: '/quan-tri/thi-truc-tuyen/cau-hoi/nhap-tep',
    component: ImportQuestion,
    layout: AdminLayout,
  },
  {
    path: '/quan-tri/thi-truc-tuyen/cau-hoi/them-moi',
    component: AddOrEditQuestion,
    layout: AdminLayout,
  },
  { path: '/quan-tri/thi-truc-tuyen/cau-hoi', component: QuestionManager, layout: AdminLayout },

  { path: '/quan-tri/tai-khoan/chinh-sua/:id', component: AddOrEditUser, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan/them-moi', component: AddOrEditUser, layout: AdminLayout },
  { path: '/quan-tri/tai-khoan', component: UserManager, layout: AdminLayout },
  { path: '/quan-tri', component: Dashboard, layout: AdminLayout },
];
