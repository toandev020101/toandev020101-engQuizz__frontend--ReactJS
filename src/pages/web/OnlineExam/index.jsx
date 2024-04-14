import {
  Box,
  useTheme,
  Button,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as ExamApi from '../../../apis/examApi';
import { useAuthContext } from '../../../contexts/authContext';
import { shuffleArray } from '../../../utils/random';
import JWTManager from './../../../utils/jwt';
import Header from './Header';
import QuestionItem from '../../components/QuestionItem';
import Sidebar from '../../components/Sidebar';
import TitlePage from './../../../components/TitlePage';
import { RiTimerFlashLine } from 'react-icons/ri';
import * as settings from '../../../settings';
import LoadingPage from '../../../components/LoadingPage';

const OnlineExam = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const questionRefs = useRef([]);
  const { isAuthenticated } = useAuthContext();

  const [exam, setExam] = useState(null);
  const [sendSocket, setSendSocket] = useState(null);
  const [timeDown, setTimeDown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [openTimeOut, setOpenTimeOut] = useState(false);
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
    const getExamById = async () => {
      setIsLoadingPage(true);
      try {
        const res = await ExamApi.getOneById(id);
        const { exam } = res.data;
        const newExam = exam;
        if (new Date() > new Date(newExam.test.end_date) || newExam.is_submitted) {
          navigate('/de-thi', {
            state: {
              notify: {
                type: 'error',
                message: 'Bài thi đã kết thúc hoặc đã nộp!',
                options: { theme: 'colored', toastId: 'authId', autoClose: 1500 },
              },
            },
          });
        }

        if (newExam.test.mix_answer) {
          newExam.exam_details.forEach((exam_detail, index) => {
            newExam.exam_details[index].question.answers = shuffleArray(
              exam_detail.question.answers,
            );
          });
        }

        setExam({ ...newExam });
        setReload(!reload);
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
      getExamById();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = JWTManager.getUserId();
      const newSendSocket = new WebSocket(
        `${settings.WEBSOCKET_URL + settings.BASE_API}/websocket/send/${id}/${userId}`,
      );
      setSendSocket(newSendSocket);

      return () => {
        if (newSendSocket && newSendSocket.readyState === WebSocket.OPEN) {
          newSendSocket.close();
          setSendSocket(null);
        }
      };
    }
  }, [isAuthenticated, id, reload]);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = JWTManager.getUserId();
      const receiveSocket = new WebSocket(
        `${settings.WEBSOCKET_URL + settings.BASE_API}/websocket/receive/${id}/${userId}`,
      );
      receiveSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'set_time') {
          setTimeDown(message.time_down);
        } else {
          setOpenTimeOut(true);
          receiveSocket.close();
          setTimeDown(0);
        }
      };

      return () => {
        if (receiveSocket && receiveSocket.readyState === WebSocket.OPEN) {
          receiveSocket.close();
        }
      };
    }
  }, [isAuthenticated, id, reload]);

  const scrollToQuestion = (index) => {
    if (questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleChoiceAnswer = async ({ question_id, answer_id, is_answer_draft = false }) => {
    if (sendSocket) {
      const message = {
        type: 'choice_answer',
        question_id: question_id,
        answer_id: answer_id,
        is_answer_draft: is_answer_draft,
      };
      await sendSocket.send(JSON.stringify(message));

      const newExam = { ...exam };
      const updateIndex = newExam.exam_details.findIndex(
        (exam_detail) => exam_detail.question.id === question_id,
      );
      if (updateIndex !== -1) {
        newExam.exam_details[updateIndex].answer_id = answer_id;
        newExam.exam_details[updateIndex].is_answer_draft = is_answer_draft;

        setExam({ ...newExam });
      }
    }
  };

  const handleExit = () => {
    setIsLoading(true);
    navigate('/de-thi');
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const message = { type: 'submit' };
    await sendSocket.send(JSON.stringify(message));
    navigate(`/de-thi/nop-bai/${id}`);

    setIsLoading(false);
  };

  const handleTimeOut = () => {
    navigate(`/de-thi/nop-bai/${id}`);
    setOpenTimeOut(false);
  };

  if (isLoadingPage) return <LoadingPage />;

  return (
    <>
      <TitlePage title="EngQuizz - Thi trực tuyến" />
      <Box position="relative">
        <Header
          user={exam?.user}
          timeDown={timeDown}
          isLoading={isLoading}
          handleExit={handleExit}
          handleSubmit={handleSubmit}
        />
        <Box
          bgcolor={theme.palette.grey[100]}
          padding="20px 150px"
          minHeight={'calc(100vh - 56.5px)'}
          display="flex"
          gap="30px"
        >
          <Box flex={2} display="flex" flexDirection={'column'} gap="20px">
            {exam &&
              (exam.test.mix_answer
                ? exam.exam_details.sort(
                    (exam_detail_1, exam_detail_2) =>
                      exam_detail_1.position - exam_detail_2.position,
                  )
                : exam.exam_details
              ).map((exam_detail, index) => (
                <QuestionItem
                  key={`question-item-${index}`}
                  exam_detail={exam_detail}
                  index={index + 1}
                  questionRefs={questionRefs}
                  handleChoiceAnswer={handleChoiceAnswer}
                />
              ))}
          </Box>
          <Sidebar
            flex={1}
            exam_details={exam ? exam.exam_details : []}
            scrollToQuestion={scrollToQuestion}
          />
        </Box>
      </Box>

      <Dialog
        open={openTimeOut}
        onClose={handleTimeOut}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          Thông báo hết giờ
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <RiTimerFlashLine fontSize={'80px'} color={theme.palette.error.main} />
            <Typography color={theme.palette.error.main} fontSize="20px">
              Đã hết thời gian làm bài.
            </Typography>
            <Typography>Bài làm của bạn đã tự động được nộp lên hệ thống.</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <Button
            variant={'contained'}
            onClick={handleTimeOut}
            color="error"
            sx={{
              textTransform: 'capitalize',
            }}
          >
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OnlineExam;
