import { Box, useTheme, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import * as UserApi from '../../apis/userApi';
import JWTManager from '../../utils/jwt';
import ToastNotify from '../../components/ToastNotify';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const getUser = async () => {
      const res = await UserApi.getOneById(JWTManager.getUserId());
      const user = res.data.user;
      if (user.is_verified) {
        navigate(!user.is_admin ? '/' : '/quan-tri');
      } else {
        navigate('/xac-minh-email');
      }
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  return (
    <Box position={'relative'}>
      <Link to="/">
        <IconButton variant="contained" sx={{ position: 'absolute', top: '20px', left: '20px' }}>
          <FaArrowLeft color={theme.palette.primary.main} />
        </IconButton>
      </Link>

      <ToastNotify />
      <Box
        bgcolor={theme.palette.grey[100]}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ width: '100vw', height: '100vh' }}
      >
        {children}
      </Box>

      <img
        src="/images/auth-v1-mask-light.png"
        alt="mask_light"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw' }}
      />
      <img
        src="/images/auth-v1-tree.png"
        alt="tree_1"
        style={{ position: 'absolute', bottom: 0, left: 0 }}
      />
      <img
        src="/images/auth-v1-tree-2.png"
        alt="tree_2"
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </Box>
  );
};

export default AuthLayout;
