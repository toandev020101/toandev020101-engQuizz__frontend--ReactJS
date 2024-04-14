import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as userApi from '../../../../apis/userApi';
import TitlePage from './../../../../components/TitlePage';
import InputField from './../../../../components/InputField';
import changePasswordSchema from '../../../../schemas/changePasswordSchema';

const ChangePassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_new_password: '',
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const handleChangePasswordSubmit = async (values) => {
    setIsLoading(true);

    try {
      const res = await userApi.changePassword(values);
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      setIsLoading(false);
      form.reset();
    } catch (error) {
      setIsLoading(false);

      const { data, status } = error.response;
      if (status === 404 || status === 400) {
        form.setError('password', { type: 'manual', message: data.detail });
      }

      if (status === 401 || status === 500) {
        navigate(`/error/${status}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="EngQuizz - Thay đổi mật khẩu" />
      <Box
        padding="15px 30px"
        boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
        borderRadius="5px"
        bgcolor={theme.palette.common.white}
        component="form"
        onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
        height="100%"
      >
        <Box paddingBottom="15px" borderBottom="1px solid #e0e0e0">
          <Typography
            fontSize="18px"
            sx={{ textTransform: 'capitalize', color: theme.palette.grey[800] }}
          >
            Đổi mật khẩu
          </Typography>
          <Typography sx={{ color: theme.palette.grey[600] }}>
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
          </Typography>
        </Box>

        <Box display="flex" justifyContent={'center'}>
          <Box
            padding="15px"
            marginTop="15px"
            width="600px"
            display="flex"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <InputField form={form} name="password" label="Mật khẩu cũ" type="password" required />

            <InputField
              form={form}
              name="new_password"
              label="Mật khẩu mới"
              type="password"
              required
            />

            <InputField
              form={form}
              name="confirm_new_password"
              label="Nhập lại mật khẩu mới"
              type="password"
              required
            />

            <LoadingButton
              variant="contained"
              loading={isLoading}
              startIcon={<BiEditIcon />}
              loadingPosition="start"
              type="submit"
              marginTop="20px"
              sx={{
                backgroundColor: theme.palette.primary.main,
                textTransform: 'none',
              }}
            >
              Lưu lại
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChangePassword;
