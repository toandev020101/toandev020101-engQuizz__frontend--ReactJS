import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Divider, Typography, Radio } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as QuestionApi from '../../../../apis/questionApi';
import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import questionSchema from '../../../../schemas/questionSchema';
import TitlePage from '../../../../components/TitlePage';

const AddOrEditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(1);
  const [disabledCorrects, setDisabledCorrects] = useState([true, true, true, true]);

  const form = useForm({
    defaultValues: {
      content: '',
      level: 'Dễ',
      answers: [
        {
          content: '',
          is_correct: false,
        },
        {
          content: '',
          is_correct: false,
        },
        {
          content: '',
          is_correct: false,
        },
        {
          content: '',
          is_correct: false,
        },
      ],
    },
    resolver: yupResolver(questionSchema),
  });

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const res = await QuestionApi.getOneById(id);
        const { question } = res.data;
        const newIsCorrect = question.answers.findIndex((answer) => answer.is_correct);
        if (newIsCorrect !== -1) {
          setIsCorrect(newIsCorrect + 1);
        }

        const newDisabledCorrects = [];
        const newAnswers = question.answers.map((answer) => {
          newDisabledCorrects.push(false);
          return {
            content: answer.content,
            is_correct: answer.is_correct,
          };
        });

        for (let i = newAnswers.length; i < 4; i++) {
          newDisabledCorrects.push(true);
          newAnswers.push({
            content: '',
            is_correct: false,
          });
        }

        setDisabledCorrects(newDisabledCorrects);

        form.reset({
          content: question.content,
          level: question.level,
          answers: [...newAnswers],
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
      getQuestion();
    }
  }, [navigate, id]);

  const handleChangeAnswer = (e, index) => {
    const newDisabledCorrects = disabledCorrects;
    if (e.target.value.length > 0) {
      newDisabledCorrects[index - 1] = false;
    } else {
      newDisabledCorrects[index - 1] = true;
      setIsCorrect(1);
    }
    setDisabledCorrects([...newDisabledCorrects]);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    values.answers = values.answers.map((answer) => {
      answer.is_correct = false;
      return answer;
    });
    values.answers[isCorrect - 1].is_correct = true;
    try {
      let res;

      if (id) {
        res = await QuestionApi.updateOne({ id, data: values });
      } else {
        res = await QuestionApi.addOne(values);
      }

      navigate('/quan-tri/thi-truc-tuyen/cau-hoi', {
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
    navigate('/quan-tri/thi-truc-tuyen/cau-hoi');
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
      <TitlePage title={`EngQuizz - ${id ? 'Chỉnh sửa câu hỏi' : 'Thêm mới câu hỏi'}`} />
      <Typography variant="h6">{id ? 'Chỉnh sửa câu hỏi' : 'Thêm mới câu hỏi'}</Typography>
      <Typography sx={{ color: '#555', fontSize: '14px' }}>
        Quản lý thông tin câu hỏi và đáp án
      </Typography>
      {/* Header */}

      <Divider sx={{ margin: '20px 0' }} />

      <Box
        component={'form'}
        onSubmit={!disabledCorrects[0] && !disabledCorrects[1] && form.handleSubmit(handleSubmit)}
        width={'100%'}
      >
        <InputField
          name="content"
          label="Nội dung câu hỏi"
          form={form}
          type="text"
          minRows={3}
          maxRows={3}
          multiline
          required
        />

        <Box margin={'20px 0'} width={'100%'}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'flex-start'}
            columnGap={'10px'}
            width={'100%'}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              columnGap={'10px'}
              width={'100%'}
            >
              <Radio
                sx={{ marginTop: id && disabledCorrects[0] ? '-30px' : '-10px' }}
                checked={isCorrect === 1}
                onChange={() => setIsCorrect(1)}
                disabled={disabledCorrects[0]}
              />
              <InputField
                name="answers[0].content"
                label="Câu trả lời 1"
                form={form}
                type="text"
                required
                onKeyUp={(e) => handleChangeAnswer(e, 1)}
                errorMessage={
                  id && disabledCorrects[0] ? 'Vui lòng nhập nội dung câu trả lời!' : null
                }
              />
            </Box>
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              columnGap={'10px'}
              width={'100%'}
            >
              <Radio
                sx={{ marginTop: id && disabledCorrects[1] ? '-30px' : '-10px' }}
                checked={isCorrect === 2}
                onChange={() => setIsCorrect(2)}
                disabled={disabledCorrects[1]}
              />
              <InputField
                name="answers[1].content"
                label="Câu trả lời 2"
                form={form}
                type="text"
                required
                onKeyUp={(e) => handleChangeAnswer(e, 2)}
                errorMessage={
                  id && disabledCorrects[1] ? 'Vui lòng nhập nội dung câu trả lời!' : null
                }
              />
            </Box>
          </Box>

          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            columnGap={'10px'}
            width={'100%'}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              columnGap={'10px'}
              width={'100%'}
            >
              <Radio
                sx={{ marginTop: '-10px' }}
                checked={isCorrect === 3}
                onChange={() => setIsCorrect(3)}
                disabled={disabledCorrects[2]}
              />
              <InputField
                name="answers[2].content"
                label="Câu trả lời 3"
                form={form}
                type="text"
                onKeyUp={(e) => handleChangeAnswer(e, 3)}
              />
            </Box>
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              columnGap={'10px'}
              width={'100%'}
            >
              <Radio
                sx={{ marginTop: '-10px' }}
                checked={isCorrect === 4}
                onChange={() => setIsCorrect(4)}
                disabled={disabledCorrects[3]}
              />
              <InputField
                name="answers[3].content"
                label="Câu trả lời 4"
                form={form}
                type="text"
                onKeyUp={(e) => handleChangeAnswer(e, 4)}
              />
            </Box>
          </Box>
        </Box>

        <SelectField
          form={form}
          name={'level'}
          label={'Độ khó'}
          valueObjects={[
            {
              label: 'Dễ',
              value: 'Dễ',
            },
            {
              label: 'Trung bình',
              value: 'Trung bình',
            },
            {
              label: 'Khó',
              value: 'Khó',
            },
          ]}
          maxWidth={'200px'}
          required
        />

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
  );
};

export default AddOrEditQuestion;
