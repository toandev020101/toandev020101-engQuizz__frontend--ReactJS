import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as ExamApi from '../../../apis/examApi';
import ExamItem from '../../../components/ExamItem';
import { useAuthContext } from '../../../contexts/authContext';
import LoadingPage from './../../../components/LoadingPage';

const Submit = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [exam, setExam] = useState(null);

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
    let timeId = null;
    const getExamById = async () => {
      setIsLoadingPage(true);
      try {
        const res = await ExamApi.getOneById(id);
        const { exam } = res.data;
        const newExam = exam;

        if (!newExam.is_submitted) {
          timeId = setTimeout(() => {
            navigate('/de-thi', {
              state: {
                notify: {
                  type: 'error',
                  message: 'Bài thi chưa làm hoặc chưa nộp!',
                  options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
                },
              },
            });
          }, 1000);
        }

        setExam({ ...newExam });
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
      setIsLoadingPage(false);
    };

    if (isAuthenticated && id) {
      getExamById();
    }

    return () => clearTimeout(timeId);
  }, [isAuthenticated, id]);

  if (isLoadingPage) return <LoadingPage />;

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap="40px"
      marginTop="50px"
    >
      <Typography variant="h5">Bài làm của bạn đã được gửi đi</Typography>
      <ExamItem exam={exam} type={'submit'} />
    </Box>
  );
};

export default Submit;
