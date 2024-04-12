import React, { useEffect, useState } from 'react';
import {
  Box,
  useTheme,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import { HiPuzzle } from 'react-icons/hi';
import { BiLogOut } from 'react-icons/bi';
import ToastNotify from '../../components/ToastNotify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import JWTManager from '../../utils/jwt';
import { toast } from 'react-toastify';
import * as UserApi from '../../apis/userApi';
import * as AuthApi from '../../apis/authApi';

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
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.data.user;
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
    <>
      <ToastNotify />
      <Box display="flex" justifyContent={'space-between'} padding={'10px 40px'}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'}>
            <HiPuzzle
              fontSize={45}
              style={{ color: theme.palette.primary.main, marginTop: '-10px' }}
            />
            <Typography
              variant="h5"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: theme.palette.primary.main,
              }}
            >
              EngQuizz
            </Typography>
          </Box>
        </Link>

        {!user ? (
          <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
            <Link to="/dang-nhap">
              <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                Đăng nhập
              </Button>
            </Link>
            <Link to="/dang-ky">
              <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }}>
                Đăng ký
              </Button>
            </Link>
          </Box>
        ) : (
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
              <Divider />

              <MenuItem onClick={handleLogout}>
                <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
              </MenuItem>
            </Menu>
            {/* avatar */}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Header;
