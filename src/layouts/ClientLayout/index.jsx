import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as UserApi from '../../apis/userApi';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';

const ClientLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.result.data;
        setUser(newUser);
      } catch (err) {
        const { status } = err.response;
        navigate(`/error/${status}`);
      }
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  return <Box>{children}</Box>;
};

export default ClientLayout;
