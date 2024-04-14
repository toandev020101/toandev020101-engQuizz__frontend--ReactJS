import React, { useEffect, useState } from 'react';
import TitlePage from '../../../../components/TitlePage';
import { Box, Typography, useTheme } from '@mui/material';
import { useAuthContext } from '../../../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import * as ExamApi from '../../../../apis/examApi';
import JWTManager from './../../../../utils/jwt';
import { toast } from 'react-toastify';
import ExamItem from './../../../../components/ExamItem';
import { CiFileOff } from 'react-icons/ci';
import LoadingPage from '../../../../components/LoadingPage';

const Exam = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [exams, setExams] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const getExamSubmits = async () => {
      setIsLoadingPage(true);
      try {
        const res = await ExamApi.getListSubmitByUserId(JWTManager.getUserId());
        setExams([...res.data.exams]);
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
      getExamSubmits();
    }
  }, [isAuthenticated]);

  if (isLoadingPage) return <LoadingPage />;

  return (
    <>
      <TitlePage title="EngQuizz - Danh sách bài thi" />
      <Box
        padding="15px 30px"
        boxShadow="0 1px 2px 0 rgba(0,0,0,.13)"
        borderRadius="5px"
        bgcolor={theme.palette.common.white}
        height="100%"
      >
        <Box paddingBottom="15px" borderBottom="1px solid #e0e0e0">
          <Typography
            fontSize="18px"
            sx={{ textTransform: 'capitalize', color: theme.palette.grey[800] }}
          >
            Danh sách bài thi
          </Typography>
          <Typography sx={{ color: theme.palette.grey[600] }}>
            Hiển thị những thông tin, kết quả, đáp án của bài thi mà bạn đã làm
          </Typography>
        </Box>

        {exams.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns={'repeat(2, 1fr)'}
            gap="15px"
            width={'100%'}
            marginTop={'20px'}
          >
            {exams.map((exam, index) => (
              <ExamItem key={`exam-item-${index}`} exam={exam} />
            ))}
          </Box>
        ) : (
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            height="100%"
            gap="20px"
          >
            <CiFileOff fontSize={'150px'} color={theme.palette.error.main} />
            <Typography fontSize={'20px'} color={theme.palette.error.main}>
              Chưa làm bài thi nào!
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Exam;
