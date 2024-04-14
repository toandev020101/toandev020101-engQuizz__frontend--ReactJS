import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Button, Divider, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as UploadApi from '../../../../apis/uploadApi';
import * as UserApi from '../../../../apis/userApi';
import InputField from '../../../../components/InputField';
import RadioGroupField from '../../../../components/RadioGroupField';
import userSchema from '../../../../schemas/userSchema';
import { dateShortValueFormat } from '../../../../utils/format';
import TitlePage from './../../../../components/TitlePage';
import JWTManager from './../../../../utils/jwt';
import { useAuthContext } from '../../../../contexts/authContext';
import * as settings from '../../../../settings';
import LoadingPage from '../../../../components/LoadingPage';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Info = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const form = useForm({
    defaultValues: {
      fullname: '',
      gender: 'Nam',
      birth_day: '2002-01-01',
      email: '',
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    const getUser = async () => {
      setIsLoadingPage(true);
      try {
        const res = await UserApi.getOneById(JWTManager.getUserId());
        const { user } = res.data;
        setAvatar(settings.SERVER_URL + user.avatar);
        form.reset({
          fullname: user.fullname,
          gender: user.gender,
          birth_day: user.birth_day,
          email: user.email,
        });
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate('/error/500');
        }
      }
      setIsLoadingPage(false);
    };

    if (isAuthenticated) {
      getUser();
    }
  }, [navigate, isAuthenticated]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    generateImageURL(file);
  };

  const generateImageURL = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageURL = event.target.result;
      setAvatar(imageURL);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values) => {
    delete values.email;
    values.birth_day = dateShortValueFormat(values.birth_day);
    setIsLoading(true);
    let formData = null;
    if (selectedFile) {
      formData = new FormData();
      formData.append('file', selectedFile);
    }

    try {
      let res;

      if (formData) {
        res = await UploadApi.uploadFile(formData);
        values.avatar = res.data.path;
      }

      res = await UserApi.updateOne({ id: JWTManager.getUserId(), data: values });

      navigate('/tai-khoan/ho-so', {
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

  if (isLoadingPage) return <LoadingPage />;

  return (
    <>
      <TitlePage title="EngQuizz - Hồ sơ của tôi" />
      <Box
        sx={{
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
          width: '100%',
          bgcolor: '#fff',
          minHeight: 'calc(100vh - 115px)',
        }}
      >
        {/* Header */}
        <Typography variant="h6">Hồ sơ của tôi</Typography>
        <Typography sx={{ color: '#555', fontSize: '14px' }}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </Typography>
        {/* Header */}

        <Divider sx={{ margin: '20px 0' }} />

        <Box display={'flex'} sx={{ width: '100%' }}>
          {/* Form */}
          <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'100%'}>
            <InputField name="fullname" label="Họ và tên" form={form} type="text" required />
            <InputField name="email" label="Email" form={form} type="email" required disabled />
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
            <LoadingButton
              loading={isLoading}
              loadingIndicator={'Loading...'}
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'none',
              }}
              disabled={isLoading}
              marginTop={'20px'}
            >
              Lưu lại
            </LoadingButton>
          </Box>
          {/* Form */}

          {/* Upload */}
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={'15px'}
            sx={{
              marginLeft: '30px',
              paddingLeft: '30px',
              borderLeft: '1px solid #e0e0e0',
              width: '800px',
            }}
          >
            <Avatar key={avatar} sx={{ width: '130px', height: '130px' }} alt="" src={avatar} />
            <Button component="label" variant="outlined" sx={{ textTransform: 'capitalize' }}>
              Chọn ảnh
              <VisuallyHiddenInput type="file" accept=".jpg, .png" onChange={handleFileChange} />
            </Button>
            <Typography sx={{ color: '#555', fontSize: '15px', textAlign: 'center' }}>
              Dung lượng file tối đa 1 MB <br /> Định dạng:.JPEG, .PNG
            </Typography>
          </Box>
          {/* Upload */}
        </Box>
      </Box>
    </>
  );
};

export default Info;
