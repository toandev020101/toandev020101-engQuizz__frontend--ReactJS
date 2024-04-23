import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiBell, BiBellOff, BiLogOut, BiUserPin } from 'react-icons/bi';
import { HiPuzzle } from 'react-icons/hi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { PiExam } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../apis/authApi';
import * as NotificationApi from '../../apis/notificationApi';
import * as UserApi from '../../apis/userApi';
import ToastNotify from '../../components/ToastNotify';
import { useAuthContext } from '../../contexts/authContext';
import * as settings from '../../settings';
import JWTManager from '../../utils/jwt';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  // notification
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const openNotification = Boolean(anchorElNotification);
  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };
  // notification

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.data.user;
        newUser.avatar = settings.SERVER_URL + newUser.avatar;
        setUser(newUser);
      } catch (error) {
        console.log(error);
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

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await NotificationApi.getListByUserId();
        setNotifications([...res.data.notifications]);
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
      getNotifications();
    }
  }, [isAuthenticated, reload]);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = JWTManager.getUserId();
      const receiveSocket = new WebSocket(
        `${settings.WEBSOCKET_URL + settings.BASE_API}/websocket/receive-notification/${userId}`,
      );
      receiveSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        toast[message.type](message.text, {
          theme: 'colored',
          toastId: 'headerId',
          autoClose: 1500,
        });
        setReload(!reload);
      };

      return () => {
        if (receiveSocket && receiveSocket.readyState === WebSocket.OPEN) {
          receiveSocket.close();
        }
      };
    }
  }, [isAuthenticated]);

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

  const handleReadAllNotification = async () => {
    try {
      await NotificationApi.readAll();
      setReload(!reload);
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
      <Box
        display="flex"
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'10px 40px'}
      >
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
          <Box display="flex" gap="10px" alignItems={'center'}>
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
                {user?.is_admin && (
                  <Link to="/quan-tri">
                    <MenuItem>
                      <MdOutlineAdminPanelSettings
                        fontSize="20px"
                        style={{ marginRight: '10px' }}
                      />{' '}
                      Quản trị
                    </MenuItem>
                  </Link>
                )}

                <Link to="/tai-khoan/ho-so">
                  <MenuItem>
                    <BiUserPin fontSize="20px" style={{ marginRight: '10px' }} /> Hồ sơ
                  </MenuItem>
                </Link>

                <Link to="/tai-khoan/bai-thi">
                  <MenuItem>
                    <PiExam fontSize="20px" style={{ marginRight: '10px' }} /> Bài thi
                  </MenuItem>
                </Link>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
            <Box>
              {/* notification */}
              <Tooltip title="Thông báo">
                <IconButton
                  size="small"
                  aria-controls={openNotification ? 'notification-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openNotification ? 'true' : undefined}
                  onClick={handleNotificationClick}
                >
                  <Badge
                    color="secondary"
                    badgeContent={
                      notifications.filter(
                        (notification) =>
                          !notification.notification_details.find(
                            (notification_detail) =>
                              notification_detail.user_id === JWTManager.getUserId(),
                          )?.is_readed,
                      )?.length
                    }
                  >
                    <BiBell fontSize={'30px'} color={theme.palette.primary.main} />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorElNotification}
                id="notification-menu"
                open={openNotification}
                onClose={handleNotificationClose}
                onClick={handleNotificationClose}
                autoFocus={false}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    maxWidth: '400px',
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
                {notifications.length === 0 ? (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    width={'400px'}
                    height={'300px'}
                    flexDirection={'column'}
                    gap="10px"
                  >
                    <BiBellOff fontSize={'70px'} color={theme.palette.error.main} />
                    <Typography color="error">Chưa có thông báo nào!</Typography>
                  </Box>
                ) : (
                  <>
                    <Box maxHeight="330px" sx={{ overflowY: 'auto' }}>
                      {notifications.map((notification) => (
                        <Box
                          key={`notification-item-${notification.id}`}
                          display="flex"
                          alignItems="center"
                          padding="10px"
                          borderBottom={`1px solid ${theme.palette.grey[300]}`}
                          sx={{
                            cursor: 'default',
                            '&:hover': { bgcolor: theme.palette.grey[200] },
                          }}
                          bgcolor={
                            notification.notification_details.find(
                              (notification_detail) =>
                                notification_detail.user_id === JWTManager.getUserId(),
                            )?.is_readed
                              ? 'transparent'
                              : theme.palette.grey[200]
                          }
                        >
                          <BiBell style={{ marginRight: '10px', fontSize: '45px' }} />
                          <Box>
                            <Typography>{notification.title}</Typography>
                            <Box>
                              {notification.content.split('\n').map((contentItem, index) => (
                                <Typography key={`content-item-${index}`} fontSize={'14px'}>
                                  {contentItem}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      padding="5px"
                      sx={{ '&:hover': { bgcolor: theme.palette.grey[200] } }}
                      onClick={handleReadAllNotification}
                    >
                      <Typography sx={{ cursor: 'pointer' }}>Đánh dấu đã xem tất cả</Typography>
                    </Box>
                  </>
                )}
              </Menu>
              {/* notification */}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Header;
