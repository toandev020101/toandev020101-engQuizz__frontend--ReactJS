import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../../apis/authApi';
import TitlePage from '../../../components/TitlePage';
import { useAuthContext } from '../../../contexts/authContext';
import JWTManager from '../../../utils/jwt';

const VerifyEmail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { setIsAuthenticated, logoutClient } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = queryParams.get('token');
        if (token) {
          const res = await AuthApi.verifyEmail({ token });
          JWTManager.setToken(res.data.access_token);
          setIsAuthenticated(true);
          const user = res.data.user;
          navigate('/', {
            state: {
              notify: {
                type: 'success',
                message: 'Xin chào, ' + user.fullname,
                options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
              },
            },
          });
        }
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
    };

    verifyEmail();
  }, [navigate]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const userId = JWTManager.getUserId();
      const res = await AuthApi.resendEmail({ userId });
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      const res = await AuthApi.logout();
      logoutClient();
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'success',
            message: res.detail,
            options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
          },
        },
      });
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      padding={'30px'}
      gap={'20px'}
      bgcolor={theme.palette.common.white}
      borderRadius={'5px'}
      boxShadow={'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px'}
      width={'600px'}
      zIndex={99}
    >
      <TitlePage title="EngQuizz - Xác minh email" />
      <img
        src="/images/email_send.png"
        alt="email.png"
        style={{ width: '150px', height: '150px' }}
      />
      <Typography variant="h5">Vui lòng xác minh email của bạn</Typography>
      <Typography variant="caption" fontSize={'16px'} textAlign={'center'}>
        Chúng tôi đã gửi tới email của bạn một liên kết dùng để xác minh email. Liên kết chỉ có hiệu
        lực trong vòng 15 phút.
      </Typography>

      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={'10px'}>
        <Link to="https://mail.google.com" target="_blank">
          <Button variant="contained" sx={{ textTransform: 'none' }}>
            Try cập email
          </Button>
        </Link>
        <LoadingButton
          variant="outlined"
          loading={isLoading}
          loadingIndicator="Loading…"
          disabled={isLoading}
          sx={{
            textTransform: 'none',
          }}
          onClick={handleResendEmail}
        >
          Gửi lại liên kết
        </LoadingButton>
        <Typography
          marginTop={'20px'}
          fontSize="14px"
          sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
          onClick={handleLogout}
        >
          Đăng nhập bằng tài khoản khác
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
