import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiHome, BiLogOut } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../apis/authApi';
import * as UserApi from '../../apis/userApi';
import ToastNotify from '../../components/ToastNotify';
import { useAuthContext } from '../../contexts/authContext';
import * as settings from '../../settings';
import JWTManager from '../../utils/jwt';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { isAuthenticated, logoutClient } = useAuthContext();

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // menu

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
        const newUser = res.data.user;
        if (!newUser.is_admin) {
          navigate('/error/403');
        }
        newUser.avatar = settings.SERVER_URL + newUser.avatar;
        setUser(newUser);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
    };
    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = async () => {
    handleClose();

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
    <Box>
      <ToastNotify />
      <AppBar
        position="static"
        sx={{
          background: 'none',
          boxShadow: 'none',
          color: theme.palette.grey[800],
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          {user && (
            <Box>
              {/* avatar */}
              <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                <Typography>Xin chào, {user?.fullname}</Typography>
                <Tooltip title="Cài đặt tài khoản">
                  <IconButton
                    size="small"
                    aria-controls={openMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 45, height: 45 }} />
                    ) : (
                      <Avatar sx={{ width: 45, height: 45 }}>{user?.fullname.charAt(0)}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleClose}
                onClick={handleClose}
                autoFocus={false}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: '200px',
                    bgcolor: theme.palette.grey[50],
                    color: theme.palette.grey[800],
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: theme.palette.grey[100],
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link to="/">
                  <MenuItem>
                    <BiHome fontSize="20px" style={{ marginRight: '10px' }} /> Trang chủ
                  </MenuItem>
                </Link>
                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
