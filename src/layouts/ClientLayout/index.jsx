import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as UserApi from '../../apis/userApi';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';
import Header from './Header';

const ClientLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

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
      <Box padding="0 40px">{children}</Box>
    </>
  );
};

export default ClientLayout;
