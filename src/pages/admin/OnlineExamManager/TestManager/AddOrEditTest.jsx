import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as QuestionApi from '../../../../apis/questionApi';
import * as TestApi from '../../../../apis/testApi';
import * as UserApi from '../../../../apis/userApi';
import InputField from '../../../../components/InputField';
import TitlePage from '../../../../components/TitlePage';
import testSchema from '../../../../schemas/testSchema';
import TransferList from './TransferList';
import { currentDateTime, dateTimeLocal } from '../../../../utils/format';
import { randomArrayInRange } from '../../../../utils/random';

const AddOrEditTest = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [autoGenerateQuestion, setAutoGenerateQuestion] = useState(true);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [userChecked, setUserChecked] = useState([]);
  const [userLeft, setUserLeft] = useState([]);
  const [userRight, setUserRight] = useState([]);

  const [questionChecked, setQuestionChecked] = useState([]);
  const [questionLeft, setQuestionLeft] = useState([]);
  const [questionRight, setQuestionRight] = useState([]);

  const [configs, setConfigs] = useState({
    mix_question: false,
    mix_answer: false,
    show_exam: false,
    show_result: false,
    show_answer: false,
  });

  const form = useForm({
    defaultValues: {
      name: '',
      start_date: currentDateTime(),
      end_date: currentDateTime(),
      exam_time: 0,
      easy_quantity: 0,
      average_quantity: 0,
      difficult_quantity: 0,
      mix_question: false,
      mix_answer: false,
      show_exam: false,
      show_result: false,
      show_answer: false,
    },
    resolver: yupResolver(testSchema),
  });

  useEffect(() => {
    const getTest = async () => {
      try {
        const res = await TestApi.getOneById(id);
        const { test } = res.data;
        form.reset({
          name: test.name,
          start_date: dateTimeLocal(test.start_date),
          end_date: dateTimeLocal(test.end_date),
          exam_time: test.exam_time / 60,
          easy_quantity: test.easy_quantity,
          average_quantity: test.average_quantity,
          difficult_quantity: test.difficult_quantity,
        });
        setAutoGenerateQuestion(false);
        setConfigs({
          mix_question: test.mix_question,
          mix_answer: test.mix_answer,
          show_exam: test.show_exam,
          show_result: test.show_result,
          show_answer: test.show_answer,
        });

        const userIds = test.exams.map((exam) => exam.user_id);

        const newUserLeft = [];
        const newUserRight = [];

        users.forEach((user, index) => {
          if (userIds.includes(user.id)) {
            newUserRight.push(index);
          } else {
            newUserLeft.push(index);
          }
        });

        setUserLeft([...newUserLeft]);
        setUserRight([...newUserRight]);

        const questionIds = test.exams[0].exam_details.map(
          (exam_detail) => exam_detail.question.id,
        );

        const newQuestionLeft = [];
        const newQuestionRight = [];

        questions.forEach((question, index) => {
          if (questionIds.includes(question.id)) {
            newQuestionRight.push(index);
          } else {
            newQuestionLeft.push(index);
          }
        });

        setQuestionLeft([...newQuestionLeft]);
        setQuestionRight([...newQuestionRight]);
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
      getTest();
    }
  }, [navigate, id, users, questions]);

  useEffect(() => {
    const getListUser = async () => {
      try {
        const res = await UserApi.getListByRole();
        const { users } = res.data;
        setUsers([...users]);
        const newUserLeft = Array(users.length)
          .fill(0)
          .map((v, index) => index);
        setUserLeft(newUserLeft);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate(`/error/${status}`);
        }
      }
    };

    const getAllQuestion = async () => {
      try {
        const res = await QuestionApi.getAll();
        const { questions } = res.data;
        setQuestions([...questions]);
        const newQuestionLeft = Array(questions.length)
          .fill(0)
          .map((v, index) => index);
        setQuestionLeft(newQuestionLeft);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (status === 500) {
          navigate(`/error/${status}`);
        }
      }
    };

    getListUser();
    getAllQuestion();
  }, [navigate]);

  const handleConfigChange = (e, name) => {
    const newConfigs = configs;
    newConfigs[name] = e.target.checked;
    setConfigs({ ...newConfigs });
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    values.exam_time = values.exam_time * 60;
    const exams = [];

    const questionChoices = [];
    if (autoGenerateQuestion) {
      const easies = [];
      const averages = [];
      const difficults = [];

      questions.forEach((question) => {
        if (question.level === 'Dễ') easies.push(question);
        else if (question.level === 'Trung bình') averages.push(question);
        else difficults.push(question);
      });

      const autoEasies = randomArrayInRange(0, easies.length - 1, values.easy_quantity);
      const autoAverages = randomArrayInRange(0, averages.length - 1, values.average_quantity);
      const autoDifficults = randomArrayInRange(
        0,
        difficults.length - 1,
        values.difficult_quantity,
      );

      autoEasies.forEach((item) => {
        questionChoices.push(easies[item]);
      });

      autoAverages.forEach((item) => {
        questionChoices.push(averages[item]);
      });

      autoDifficults.forEach((item) => {
        questionChoices.push(difficults[item]);
      });
    } else {
      questionRight.forEach((item) => {
        questionChoices.push(questions[item]);
      });
    }

    const userChoices = [];
    userRight.forEach((item) => {
      userChoices.push(users[item]);
    });

    let questionChoiceIds = null;
    let randomQuestions = null;
    userChoices.forEach((userChoice) => {
      questionChoiceIds = [];

      if (values.mix_question) {
        randomQuestions = randomArrayInRange(0, questionChoices.length - 1, questionChoices.length);
        questionChoiceIds = randomQuestions.map((item) => questionChoices[item].id);
      } else {
        questionChoiceIds = questionChoices.map((questionChoice) => questionChoice.id);
      }

      exams.push({
        user_id: userChoice.id,
        question_ids: questionChoiceIds,
      });
    });

    values.exams = exams;

    values = { ...values, ...configs };

    try {
      let res;

      if (id) {
        res = await TestApi.updateOne({ id, data: values });
      } else {
        res = await TestApi.addOne(values);
      }

      navigate('/quan-tri/thi-truc-tuyen/de-thi', {
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
    navigate('/quan-tri/thi-truc-tuyen/de-thi');
  };

  return (
    <Box display="flex" gap="20px">
      <Box
        flex="3"
        sx={{
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
          width: '100%',
          bgcolor: '#fff',
        }}
      >
        {/* Header */}
        <TitlePage title={`EngQuizz - ${id ? 'Chỉnh sửa đề thi' : 'Thêm mới đề thi'}`} />
        <Typography variant="h6">{id ? 'Chỉnh sửa đề thi' : 'Thêm mới đề thi'}</Typography>
        <Typography sx={{ color: '#555', fontSize: '14px' }}>
          Quản lý thông tin đề thi và câu hỏi
        </Typography>
        {/* Header */}

        <Divider sx={{ margin: '20px 0' }} />

        <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'100%'}>
          <InputField name="name" label="Tên đề thi" form={form} type="text" required />
          <Box display="flex" gap="10px">
            <InputField
              name="start_date"
              label="Thời gian bắt đầu"
              form={form}
              type="datetime-local"
              required
            />
            <InputField
              name="end_date"
              label="Thời gian kết thúc"
              form={form}
              type="datetime-local"
              required
            />
          </Box>
          <Box position="relative" sx={{ maxWidth: '250px' }}>
            <InputField
              name="exam_time"
              label="Thời gian làm bài"
              form={form}
              type="number"
              min="0"
              required
            />
            <Typography position="absolute" top="17px" right="30px" color={theme.palette.grey[500]}>
              phút
            </Typography>
          </Box>

          <Box display="flex" gap="10px">
            <InputField
              name="easy_quantity"
              label="Số câu dễ"
              form={form}
              type="number"
              min="0"
              required
            />
            <InputField
              name="average_quantity"
              label="Số câu trung bình"
              form={form}
              type="number"
              min="0"
              required
            />
            <InputField
              name="difficult_quantity"
              label="Số câu khó"
              form={form}
              type="number"
              min="0"
              required
            />
          </Box>

          <Box display="flex" flexDirection="column" gap="10px">
            <Typography>Danh sách sinh viên *</Typography>
            <TransferList
              type="user"
              list={users}
              checked={userChecked}
              setChecked={setUserChecked}
              left={userLeft}
              setLeft={setUserLeft}
              right={userRight}
              setRight={setUserRight}
            />
          </Box>

          {!autoGenerateQuestion && (
            <Box display="flex" flexDirection="column" gap="10px" marginTop="10px">
              <Typography>Danh sách câu hỏi *</Typography>
              <TransferList
                type="question"
                list={questions}
                checked={questionChecked}
                setChecked={setQuestionChecked}
                left={questionLeft}
                setLeft={setQuestionLeft}
                right={questionRight}
                setRight={setQuestionRight}
                easyQuantity={form.getValues('easy_quantity')}
                averageQuantity={form.getValues('average_quantity')}
                difficultQuantity={form.getValues('difficult_quantity')}
              />
            </Box>
          )}

          <Box display="flex" justifyContent={'center'} gap="10px" marginTop={'20px'}>
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
      </Box>

      <Box
        flex="1"
        sx={{
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
          width: '100%',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="h6" marginBottom="20px">
          Cấu hình
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={autoGenerateQuestion}
                onChange={(e) => setAutoGenerateQuestion(e.target.checked)}
              />
            }
            label="Tự động lấy câu hỏi từ ngân hàng"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.mix_question}
                onChange={(e) => handleConfigChange(e, 'mix_question')}
              />
            }
            label="Trộn câu hỏi"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.mix_answer}
                onChange={(e) => handleConfigChange(e, 'mix_answer')}
              />
            }
            label="Trộn đáp án"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.show_exam}
                onChange={(e) => handleConfigChange(e, 'show_exam')}
              />
            }
            label="Hiển thị kết quả sau khi thi xong"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.show_result}
                onChange={(e) => handleConfigChange(e, 'show_result')}
              />
            }
            label="Hiển thị bài làm sau khi thi xong"
          />
          <FormControlLabel
            control={
              <Switch
                checked={configs.show_answer}
                onChange={(e) => handleConfigChange(e, 'show_answer')}
              />
            }
            label="Hiển thị đáp án sau khi thi xong"
          />
        </FormGroup>
      </Box>
    </Box>
  );
};

export default AddOrEditTest;
