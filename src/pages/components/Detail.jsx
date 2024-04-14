import { Box, FormControlLabel, IconButton, Switch, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoCloseCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { LuCalendarCheck } from 'react-icons/lu';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as ExamApi from '../../apis/examApi';
import LoadingPage from '../../components/LoadingPage';
import { useAuthContext } from '../../contexts/authContext';
import { dateTimeFullFormat } from '../../utils/format';
import QuestionItem from './QuestionItem';
import Sidebar from './Sidebar';
import { FaArrowLeft } from 'react-icons/fa6';

const Detail = ({ prevPath }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const { isAuthenticated } = useAuthContext();
  const questionRefs = useRef([]);

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [exam, setExam] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
          navigate(prevPath, {
            state: {
              notify: {
                type: 'error',
                message: 'Bài thi chưa làm hoặc chưa nộp!',
                options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
              },
            },
          });
        }
        setShowAnswer(exam.test.show_answer && !exam.test.show_exam);
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

  const scrollToQuestion = (index) => {
    if (questionRefs?.current[index]) {
      questionRefs?.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isLoadingPage) return <LoadingPage />;

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap="20px"
      position={'relative'}
    >
      <Link to={prevPath}>
        <IconButton variant="contained" sx={{ position: 'absolute', top: '20px', left: '20px' }}>
          <FaArrowLeft color={theme.palette.primary.main} />
        </IconButton>
      </Link>

      <Typography variant="h6">{exam?.test.name}</Typography>

      {exam?.test.show_result && (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          borderRadius={'5px'}
          boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
          padding="15px"
          gap="15px"
          minWidth={'450px'}
          bgcolor={theme.palette.common.white}
        >
          <Typography variant="h6" marginBottom={'10px'}>
            Điểm của bạn là: {exam?.result.score.toFixed(2)}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" gap="5px">
              <IoTimeOutline fontSize={'25px'} />
              <Typography>Thời gian làm bài</Typography>
            </Box>
            <Typography>{Math.round(exam?.exam_time / 60)} phút</Typography>
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
              <Typography>Số lượng câu hỏi đúng</Typography>
            </Box>
            <Typography>
              {exam?.result.correct_quantity} / {exam?.exam_details.length}
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
              <IoCloseCircleOutline fontSize={'25px'} />
              <Typography>Số lượng câu hỏi sai</Typography>
            </Box>
            <Typography>
              {exam?.exam_details.length - exam?.result.correct_quantity} /{' '}
              {exam?.exam_details.length}
            </Typography>
          </Box>
        </Box>
      )}

      {exam?.test.show_answer && (
        <Box display={'flex'} justifyContent={'flex-end'}>
          <FormControlLabel
            control={
              <Switch checked={showAnswer} onChange={(e) => setShowAnswer(e.target.checked)} />
            }
            label="Kiểm tra đáp án"
          />
        </Box>
      )}

      {(exam?.test.show_exam || exam?.test.show_answer) && (
        <Box padding="20px 150px" display="flex" gap="30px">
          <Box flex={2} display="flex" flexDirection={'column'} gap="20px">
            {exam &&
              exam.exam_details.map((exam_detail, index) => (
                <QuestionItem
                  key={`question-item-${index}`}
                  exam_detail={exam_detail}
                  index={index + 1}
                  questionRefs={questionRefs}
                  handleChoiceAnswer={() => {}}
                  readonly
                  showAnswer={showAnswer}
                />
              ))}
          </Box>
          <Sidebar
            flex={1}
            exam_details={exam ? exam.exam_details : []}
            scrollToQuestion={scrollToQuestion}
            showAnswer={showAnswer}
            noTop
          />
        </Box>
      )}
    </Box>
  );
};

export default Detail;
