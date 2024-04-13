import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import {
  BiEditAlt as BiEditAltIcon,
  BiRadioCircle as BiRadioCircleIcon,
  BiUserPin,
} from 'react-icons/bi';
import { PiExam } from 'react-icons/pi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JWTManager from './../../utils/jwt';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../contexts/authContext';
import * as UserApi from '../../apis/userApi';
import * as settings from '../../settings';

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [user, setUser] = useState(null);

  const navItems = [
    {
      slug: 'tai-khoan',
      name: 'Tài khoản của tôi',
      icon: <BiUserPin />,
      child: [
        {
          slug: 'ho-so',
          name: 'Hồ sơ',
        },
        {
          slug: 'thay-doi-mat-khau',
          name: 'Đổi mật khẩu',
        },
      ],
    },
    {
      slug: 'tai-khoan/bai-thi',
      name: 'Bài thi',
      icon: <PiExam />,
    },
  ];

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    if (!!pathnameArr[2]) {
      setOpenMenu(pathnameArr[1]);
    }
  }, [pathname]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = JWTManager.getUserId();
        const res = await UserApi.getOneById(userId);
        const newUser = res.data.user;
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

  return (
    <Box
      width="300px"
      bgcolor={theme.palette.common.white}
      borderRadius={'5px'}
      boxShadow={'rgba(99, 99, 99, 0.1) 0px 2px 8px 0px'}
      padding="15px"
    >
      {/* header */}
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        paddingBottom="20px"
        borderBottom="1px solid #f0f0f0"
      >
        {user?.avatar ? (
          <Avatar src={user?.avatar} alt={user?.email} sx={{ width: '55px', height: '55px' }} />
        ) : (
          <Avatar sx={{ width: '55px', height: '55px' }}>{user?.fullname.slice(0, 1)}</Avatar>
        )}
        <Box>
          <Typography fontSize="18px" fontWeight={500}>
            {user?.fullname}
          </Typography>
          <Link to="/tai-khoan/ho-so">
            <Box display="flex" alignItems="center" gap="5px" color={theme.palette.grey[600]}>
              <BiEditAltIcon fontSize="18px" />
              <Typography>Sửa hồ sơ</Typography>
            </Box>
          </Link>
        </Box>
      </Box>
      {/* header */}

      {/* menu */}
      <List disablePadding sx={{ marginTop: '20px' }}>
        {navItems.map((nav, index) => (
          <Fragment key={`nav-item-${index}`}>
            {nav.child ? (
              <Fragment key={`nav-child-item-${index}`}>
                <ListItem
                  onClick={() => setOpenMenu(openMenu !== nav.slug ? nav.slug : null)}
                  sx={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: theme.palette.grey[100],
                    },
                    bgcolor:
                      openMenu === nav.slug || nav.slug === pathname.split('/')[0]
                        ? theme.palette.grey[100]
                        : 'transparent',
                  }}
                  disablePadding
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '22px',
                      marginRight: '10px',
                      minWidth: 0,
                      color: theme.palette.grey[900],
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={nav.name}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '15px' } }}
                  />
                </ListItem>

                <Collapse
                  in={openMenu === nav.slug || nav.slug === pathname.split('/')[0]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {nav.child.map((navChild, index) => (
                      <Link to={`/${nav.slug}/${navChild.slug}`} key={`nav-item-child-${index}`}>
                        <ListItem
                          sx={{
                            marginTop: '5px',
                            padding: '10px 20px 10px 30px',
                            borderRadius: '10px',
                            '&:hover': {
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.common.white,
                            },
                            bgcolor:
                              pathname.split('/')[1] === nav.slug &&
                              navChild.slug === pathname.split('/')[2]
                                ? theme.palette.primary.main
                                : 'transparent',

                            color:
                              pathname.split('/')[1] === nav.slug &&
                              navChild.slug === pathname.split('/')[2]
                                ? theme.palette.common.white
                                : 'inherit',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              fontSize: '22px',
                              marginRight: '10px',
                              minWidth: 0,
                              color:
                                pathname.split('/')[1] === nav.slug &&
                                navChild.slug === pathname.split('/')[2]
                                  ? theme.palette.common.white
                                  : 'inherit',
                            }}
                          >
                            <BiRadioCircleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={navChild.name}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '15px',
                              },
                            }}
                          />
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <Link to={`/${nav.slug}`}>
                <ListItem
                  onClick={() => setOpenMenu(null)}
                  sx={{
                    marginTop: '5px',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                    },
                    bgcolor:
                      pathname === '/' + nav.slug ? theme.palette.primary.main : 'transparent',

                    color: pathname === '/' + nav.slug ? theme.palette.common.white : 'inherit',
                  }}
                  disablePadding
                >
                  <ListItemIcon
                    sx={{
                      fontSize: '22px',
                      marginRight: '10px',
                      minWidth: 0,
                      color: pathname === '/' + nav.slug ? theme.palette.common.white : 'inherit',
                    }}
                  >
                    {nav.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={nav.name}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '15px',
                      },
                    }}
                  />
                </ListItem>
              </Link>
            )}
          </Fragment>
        ))}
      </List>
      {/* menu */}
    </Box>
  );
};

export default Sidebar;
