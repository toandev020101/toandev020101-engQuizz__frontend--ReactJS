import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GoQuestion } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoTimeOutline } from 'react-icons/io5';
import { LuCalendarCheck } from 'react-icons/lu';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as ExamApi from '../../../apis/examApi';
import { useAuthContext } from '../../../contexts/authContext';
import { dateTimeFullFormat } from '../../../utils/format';
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
      try {
        const res = await ExamApi.getOneById(id);
        const { exam } = res.data;
        const newExam = exam;

        if (!newExam.is_submitted) {
          navigate('/de-thi', {
            state: {
              notify: {
                type: 'error',
                message: 'Bài thi chưa làm hoặc chưa nộp!',
                options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
              },
            },
          });
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
    };

    if (isAuthenticated && id) {
      timeId = setTimeout(() => {
        getExamById();
        setIsLoadingPage(false);
      }, 500);
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
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        gap="15px"
        width={'450px'}
      >
        <Typography variant="h6" marginBottom={'10px'}>
          {exam?.test.name}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center" gap="5px">
            <IoTimeOutline fontSize={'25px'} />
            <Typography>Thời gian làm bài</Typography>
          </Box>
          <Typography>{Math.floor(exam?.exam_time / 60)} phút</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center" gap="5px">
            <LuCalendarCheck fontSize={'24px'} />
            <Typography>Thời gian vào thi</Typography>
          </Box>
          <Typography>{dateTimeFullFormat(exam?.exam_time_at)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center" gap="5px">
            <IoIosCheckmarkCircleOutline fontSize={'25px'} />
            <Typography>Số lượng câu đã làm</Typography>
          </Box>
          <Typography>
            {exam?.exam_details.filter((exam_detail) => exam_detail.answer_id !== null).length}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          marginBottom="20px"
        >
          <Box display="flex" alignItems="center" gap="5px">
            <GoQuestion fontSize={'24px'} />
            <Typography>Số lượng câu hỏi trong đề</Typography>
          </Box>
          <Typography>{exam?.exam_details.length}</Typography>
        </Box>

        <Box display="flex" gap="10px">
          <Link to={`/tai-khoan/bai-thi/ket-qua/${id}`}>
            <Button variant="contained" sx={{ textTransform: 'none' }} color="success">
              Xem kết quả
            </Button>
          </Link>
          <Link to="/">
            <Button variant="contained" sx={{ textTransform: 'none' }}>
              Trang chủ
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Submit;
