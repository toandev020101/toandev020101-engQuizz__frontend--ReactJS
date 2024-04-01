import { Box, Button, Typography, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TitlePage from '../../../components/TitlePage';
import * as AuthApi from '../../../apis/authApi';
import JWTManager from '../../../utils/jwt';
import { useAuthContext } from '../../../contexts/authContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { setIsAuthenticated } = useAuthContext();

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
      await AuthApi.resendEmail({ userId });
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

  const theme = useTheme();
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
      </Box>
    </Box>
  );
};

export default VerifyEmail;
