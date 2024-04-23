import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as NotificationApi from '../../../apis/notificationApi';
import * as UserApi from '../../../apis/userApi';
import InputField from '../../../components/InputField';
import TitlePage from '../../../components/TitlePage';
import TransferList from '../../../components/TransferList';
import notificationSchema from './../../../schemas/notificationSchema';

const AddNotification = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChecked, setUserChecked] = useState([]);
  const [userLeft, setUserLeft] = useState([]);
  const [userRight, setUserRight] = useState([]);

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    resolver: yupResolver(notificationSchema),
  });

  useEffect(() => {
    const getListUser = async () => {
      try {
        const res = await UserApi.getListByRole();
        const { users } = res.data;
        setUsers([...users]);
        const newUserLeft = Array(users.length)
          .fill(0)
          .map((v, index) => index);
        setUserLeft(newUserLeft);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate(`/error/${status}`);
        }
      }
    };

    getListUser();
  }, [navigate]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const userIds = [];
    userRight.forEach((item) => {
      userIds.push(users[item].id);
    });
    values.user_ids = userIds;
    try {
      const res = await NotificationApi.addOne(values);

      navigate('/quan-tri/thong-bao', {
        state: {
          notify: {
            type: 'success',
            message: res.detail,
            options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
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
    setIsLoading(false);
  };

  const handleClose = () => {
    navigate('/quan-tri/thong-bao');
  };

  return (
    <Box
      flex="3"
      sx={{
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
        width: '100%',
        bgcolor: '#fff',
      }}
    >
      {/* Header */}
      <TitlePage title={`EngQuizz - Thêm mới thông báo`} />
      <Typography variant="h6">Thêm mới thông báo</Typography>
      <Typography sx={{ color: '#555', fontSize: '14px' }}>Quản lý thông tin thông báo</Typography>
      {/* Header */}

      <Divider sx={{ margin: '20px 0' }} />

      <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'100%'}>
        <InputField name="title" label="Tiêu đề" form={form} type="text" required />
        <InputField
          name="content"
          label="Nội dung"
          form={form}
          type="text"
          minRows={3}
          maxRows={3}
          multiline
          required
        />
        <Box display="flex" flexDirection="column" gap="10px">
          <Typography>Danh sách học viên *</Typography>
          <TransferList
            type="user"
            list={users}
            checked={userChecked}
            setChecked={setUserChecked}
            left={userLeft}
            setLeft={setUserLeft}
            right={userRight}
            setRight={setUserRight}
          />
        </Box>

        <Box display="flex" justifyContent={'center'} gap="10px" marginTop={'20px'}>
          <LoadingButton
            loading={isLoading}
            loadingIndicator={'Loading...'}
            variant="contained"
            type="submit"
            sx={{
              textTransform: 'none',
            }}
            disabled={isLoading}
          >
            Thêm mới
          </LoadingButton>
          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
            }}
            onClick={handleClose}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNotification;
