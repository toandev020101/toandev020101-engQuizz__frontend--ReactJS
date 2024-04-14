import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from './../../utils/jwt';
import * as UserApi from '../../apis/userApi';
import Header from '../components/Header';
import { Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

const UserLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const timeId = setTimeout(() => {
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'error',
            message: 'Vui lòng đăng nhập!',
            options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
          },
        },
      });
    }, 1000);

    if (isAuthenticated) {
      clearTimeout(timeId);
    }

    return () => clearTimeout(timeId);
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const { user } = res.data;
        if (!user.is_verified) {
          navigate('/xac-minh-email');
        }
      } catch (err) {
        const { status } = err.response;
        navigate(`/error/${status}`);
      }
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  return (
    <>
      <Header />
      <Box
        padding="20px 40px"
        display={'flex'}
        gap="20px"
        bgcolor={theme.palette.grey[50]}
        minHeight={'calc(100vh - 75px)'}
      >
        <Sidebar />
        <Box width={'calc(100vw - 360px)'}>{children}</Box>
      </Box>
    </>
  );
};

export default UserLayout;
