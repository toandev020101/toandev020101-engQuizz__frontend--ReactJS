import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CiFileOff } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as ExamApi from '../../../apis/examApi';
import { useAuthContext } from '../../../contexts/authContext';
import ExamItem from './TestItem';
import TitlePage from '../../../components/TitlePage';
import LoadingPage from './../../../components/LoadingPage';

const Test = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuthContext();
  const [exams, setExams] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

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
    const getExams = async () => {
      setIsLoadingPage(true);
      try {
        const res = await ExamApi.getListByUserId();
        const { exams } = res.data;
        setExams([...exams]);
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

    if (isAuthenticated) {
      getExams();
    }
  }, [isAuthenticated]);

  if (isLoadingPage) return <LoadingPage />;

  return (
    <Box>
      <TitlePage title="EngQuizz - Vào thi" />
      {exams.length === 0 ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems="center"
          height={'calc(100vh - 75px)'}
          gap="20px"
        >
          <CiFileOff fontSize={'150px'} color={theme.palette.error.main} />
          <Typography variant="h5">Chưa có bài thi nào được giao !</Typography>
          <Link to="/">
            <Button variant="contained" sx={{ textTransform: 'none', minWidth: '120px' }}>
              Trang chủ
            </Button>
          </Link>
        </Box>
      ) : (
        <Box display={'grid'} gridTemplateColumns={'repeat(4, 1fr)'} gap="15px" margin="20px 0">
          {exams.map((exam, index) => (
            <ExamItem key={`exam-item-${index}`} item={exam} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Test;
