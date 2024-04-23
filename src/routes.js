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
import TestManager from './pages/admin/OnlineExamManager/TestManager';
import AddOrEditTest from './pages/admin/OnlineExamManager/TestManager/AddOrEditTest';
import Test from './pages/web/Test';
import OnlineExam from './pages/web/OnlineExam';
import Submit from './pages/web/OnlineExam/Submit';
import UserLayout from './layouts/UserLayout';
import Info from './pages/web/User/Info';
import Exam from './pages/web/User/Exam';
import Detail from './pages/components/Detail';
import ChangePassword from './pages/web/User/Info/ChangePassword';
import ExamManager from './pages/admin/OnlineExamManager/ExamManager';
import DetailLayout from './layouts/AdminLayout/DetailLayout';
import ForgotPassword from './pages/auth/ForgotPassword';
import AddNotification from './pages/admin/NotificationManager/AddNotification';
import NotificationManager from './pages/admin/NotificationManager/index';

export const publicRoutes = [
  // auth
  { path: '/quen-mat-khau', component: ForgotPassword, layout: AuthLayout },
  { path: '/xac-minh-email', component: VerifyEmail, layout: AuthLayout },
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },

  // web
  { path: '/', component: Home, layout: ClientLayout },
];

export const privateRoutes = [
  // user
  {
    path: '/tai-khoan/bai-thi/:id',
    component: Detail,
    layout: ClientLayout,
    prevPath: '/tai-khoan/bai-thi',
  },
  { path: '/tai-khoan/bai-thi', component: Exam, layout: UserLayout },

  { path: '/tai-khoan/thay-doi-mat-khau', component: ChangePassword, layout: UserLayout },
  { path: '/tai-khoan/ho-so', component: Info, layout: UserLayout },

  { path: '/de-thi/nop-bai/:id', component: Submit, layout: ClientLayout },
  { path: '/de-thi/thi-truc-tuyen/:id', component: OnlineExam, layout: null },
  { path: '/de-thi', component: Test, layout: ClientLayout },

  // admin
  { path: '/quan-tri/thong-bao/them-moi', component: AddNotification, layout: AdminLayout },
  { path: '/quan-tri/thong-bao', component: NotificationManager, layout: AdminLayout },

  {
    path: '/quan-tri/thi-truc-tuyen/bai-thi/:id',
    component: Detail,
    layout: DetailLayout,
    prevPath: '/quan-tri/thi-truc-tuyen/bai-thi',
  },
  { path: '/quan-tri/thi-truc-tuyen/bai-thi', component: ExamManager, layout: AdminLayout },

  {
    path: '/quan-tri/thi-truc-tuyen/de-thi/chinh-sua/:id',
    component: AddOrEditTest,
    layout: AdminLayout,
  },
  {
    path: '/quan-tri/thi-truc-tuyen/de-thi/them-moi',
    component: AddOrEditTest,
    layout: AdminLayout,
  },
  { path: '/quan-tri/thi-truc-tuyen/de-thi', component: TestManager, layout: AdminLayout },

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
