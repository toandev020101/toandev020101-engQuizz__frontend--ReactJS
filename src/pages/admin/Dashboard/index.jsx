import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { GrCircleQuestion } from 'react-icons/gr';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { LuCalendarClock } from 'react-icons/lu';
import { PiExam } from 'react-icons/pi';
import { TbUsers } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import * as UserApi from '../../../apis/userApi';
import * as TestAPi from '../../../apis/testApi';
import * as ExamApi from '../../../apis/examApi';
import * as QuestionApi from '../../../apis/questionApi';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../contexts/authContext';
import LoadingPage from './../../../components/LoadingPage';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [studentCount, setStudentCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [studentSubmitCount, setStudentSubmitCount] = useState(0);
  const [studentNotSubmitCount, setStudentNotSubmitCount] = useState(0);
  const [studentNotJoinCount, setStudentNotJoinCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const getCount = async () => {
      setIsLoadingPage(true);
      try {
        let res = await UserApi.countStudent();
        setStudentCount(res.data.count);

        res = await TestAPi.countAll();
        setTestCount(res.data.count);

        res = await ExamApi.countAll();
        setExamCount(res.data.count);

        res = await QuestionApi.countAll();
        setQuestionCount(res.data.count);

        res = await ExamApi.getAll();
        const { exams } = res.data;

        let newStudentSubmitCount = 0;
        let newStudentNotSubmitCount = 0;
        let newStudentNotJoinCount = 0;
        let totalScore = 0;
        exams.forEach((exam) => {
          if (exam.is_submitted) {
            newStudentSubmitCount++;
            totalScore += exam.result.score;
          } else if (new Date() > new Date(exam.test.end_date)) {
            if (exam.exam_time_at) newStudentNotSubmitCount++;
            else newStudentNotJoinCount++;
          }
        });

        setStudentSubmitCount(newStudentSubmitCount);
        setStudentNotSubmitCount(newStudentNotSubmitCount);
        setStudentNotJoinCount(newStudentNotJoinCount);
        setAverageScore(
          newStudentSubmitCount !== 0 ? Math.round(totalScore / newStudentSubmitCount) : 0,
        );
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate(`/error/${status}`);
        }
      }
      setIsLoadingPage(false);
    };

    if (isAuthenticated) {
      getCount();
    }
  }, [navigate, isAuthenticated]);

  if (isLoadingPage) return <LoadingPage />;

  return (
    <Box display="grid" gridTemplateColumns={'repeat(4, 1fr)'} gap="15px">
      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.primary.main}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <TbUsers fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Học viên</Typography>
          <Typography variant="h4">{studentCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.secondary.main}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <LuCalendarClock fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Đề thi</Typography>
          <Typography variant="h4">{testCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.success.main}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <IoDocumentTextOutline fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Bài thi</Typography>
          <Typography variant="h4">{examCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.warning.main}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <GrCircleQuestion fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Câu hỏi</Typography>
          <Typography variant="h4">{questionCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.success.light}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <TbUsers fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Học viên thi</Typography>
          <Typography variant="h4">{studentSubmitCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.warning.light}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <TbUsers fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Học viên bỏ thi</Typography>
          <Typography variant="h4">{studentNotSubmitCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.error.light}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <TbUsers fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Học viên không thi</Typography>
          <Typography variant="h4">{studentNotJoinCount}</Typography>
        </Box>
      </Box>

      <Box
        borderRadius={'5px'}
        boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        padding="15px"
        bgcolor={theme.palette.error.light}
        color={theme.palette.common.white}
        display={'flex'}
        alignItems={'center'}
        gap="20px"
      >
        <PiExam fontSize={'60px'} />
        <Box display={'flex'} alignItems={'center'} gap="10px" flexDirection={'column'}>
          <Typography variant="h5">Điểm trung bình</Typography>
          <Typography variant="h4">{averageScore}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
