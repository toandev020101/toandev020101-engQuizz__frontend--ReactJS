import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as AuthApi from '../../../apis/authApi';
import InputField from '../../../components/InputField';
import RadioGroupField from '../../../components/RadioGroupField';
import registerSchema from '../../../schemas/registerSchema';
import JWTManager from '../../../utils/jwt';
import { useAuthContext } from '../../../contexts/authContext';
import { dateShortValueFormat } from '../../../utils/format';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuthContext();

  const form = useForm({
    defaultValues: {
      fullname: '',
      gender: 'Nam',
      birth_day: '2002-01-01',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = async (values) => {
    values.birth_day = dateShortValueFormat(values.birth_day);
    setIsLoading(true);
    try {
      const res = await AuthApi.register(values);
      JWTManager.setToken(res.data.access_token);
      setIsAuthenticated(true);
      navigate('/xac-minh-email');
      form.reset();
      setIsLoading(false);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        if (status === 400) {
          form.setError('email', { type: 'manual', message: data.detail });
        }
        toast.error('Đăng ký thất bại!', { theme: 'colored', toastId: 'authId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)}>
      <InputField name="fullname" label="Họ và tên" form={form} type="text" required />
      <RadioGroupField
        name="gender"
        label="Giới tính"
        form={form}
        required
        options={[
          { label: 'Nam', value: 'Nam' },
          { label: 'Nữ', value: 'Nữ' },
        ]}
        type="horizontal"
      />
      <InputField name="birth_day" label="Ngày sinh" form={form} type="date" required />
      <InputField name="email" label="Email" form={form} type="email" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <InputField
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        form={form}
        type="password"
        required
      />
      <LoadingButton
        variant="contained"
        loading={isLoading}
        loadingIndicator="Loading…"
        type="submit"
        fullWidth
        disabled={isLoading}
        sx={{
          textTransform: 'inherit',
          height: '45px',
          fontWeight: 600,
          margin: '20px 0',
        }}
      >
        Đăng ký
      </LoadingButton>
    </Box>
  );
};

export default RegisterForm;
