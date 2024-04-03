import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Button, Divider, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as UploadApi from '../../../apis/uploadApi';
import * as UserApi from '../../../apis/userApi';
import InputField from '../../../components/InputField';
import RadioGroupField from '../../../components/RadioGroupField';
import userSchema from '../../../schemas/userSchema';
import { dateShortValueFormat } from '../../../utils/format';
import SelectField from '../../../components/SelectField';

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

const AddOrEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      fullname: '',
      gender: 'Nam',
      birth_day: '2002-01-01',
      email: '',
      password: '',
      confirm_password: '',
      is_admin: false,
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await UserApi.getOneById(id);
        const { user } = res.data;
        setAvatar(user.avatar);
        form.reset({
          fullname: user.fullname,
          gender: user.gender,
          birth_day: user.birth_day,
          email: user.email,
          is_admin: user.is_admin,
        });
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate('/error/500');
        }
      }
    };

    if (id) {
      getUser();
    }
  }, [navigate, id]);

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

      if (id) {
        res = await UserApi.updateOne({ id, data: values });
      } else {
        res = await UserApi.addOne(values);
      }

      navigate('/quan-tri/tai-khoan', {
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
    navigate('/quan-tri/tai-khoan');
  };

  return (
    <Box
      sx={{
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
        width: '100%',
        bgcolor: '#fff',
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
          <InputField
            name="email"
            label="Email"
            form={form}
            type="email"
            required
            disabled={!!id}
          />
          {!id && (
            <>
              <InputField name="password" label="Mật khẩu" form={form} type="password" required />
              <InputField
                name="confirm_password"
                label="Xác nhận mật khẩu"
                form={form}
                type="password"
                required
              />
            </>
          )}

          <SelectField
            form={form}
            name={'is_admin'}
            label={'Vai trò'}
            valueObjects={[
              {
                label: 'Quản trị viên',
                value: true,
              },
              {
                label: 'Học viên',
                value: false,
              },
            ]}
            required
          />

          <Box display="flex" gap="10px" marginTop={'20px'}>
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
              {id ? 'Lưu lại' : 'Thêm mới'}
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
  );
};

export default AddOrEditUser;
