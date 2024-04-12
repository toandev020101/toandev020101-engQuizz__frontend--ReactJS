import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

const choices = ['A', 'B', 'C', 'D'];

const QuestionItem = ({ exam_detail, index, questionRefs, handleChoiceAnswer }) => {
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.common.white}
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      borderRadius={'5px'}
      ref={(ref) => (questionRefs.current[index] = ref)}
    >
      <Box padding="15px">
        <Typography variant="h6" fontSize={'18px'} fontWeight={600} marginBottom={'20px'}>
          {index}. {exam_detail.question.content}
        </Typography>

        <Box display="grid" gridTemplateColumns={'repeat(2, 1fr)'} gap="10px">
          {exam_detail.question.answers.map((answer, idx) => (
            <Typography key={`answer-item-${answer.id}`}>
              <strong>{choices[idx]}.</strong> {answer.content}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box
        bgcolor={theme.palette.primary.main}
        sx={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}
        color={theme.palette.common.white}
        padding="10px 20px"
        display={'flex'}
        gap="10px"
        alignItems={'center'}
      >
        <Typography fontSize={'14px'}>Đáp án của bạn là:</Typography>
        {exam_detail.question.answers.map((answer, idx) => (
          <Box
            key={`answer-item-${answer.id}`}
            bgcolor={theme.palette.common.white}
            color={theme.palette.common.black}
            borderRadius={'50%'}
            width={'36px'}
            height={'36px'}
            textAlign={'center'}
            lineHeight={'36px'}
            fontWeight={600}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: theme.palette.secondary.light,
                color: theme.palette.common.white,
              },

              bgcolor:
                exam_detail.answer_id === answer.id
                  ? exam_detail.is_answer_draft
                    ? theme.palette.warning.main
                    : theme.palette.secondary.light
                  : theme.palette.common.white,
              color:
                exam_detail.answer_id === answer.id
                  ? theme.palette.common.white
                  : theme.palette.common.black,
            }}
            onClick={() =>
              handleChoiceAnswer({ question_id: exam_detail.question.id, answer_id: answer.id })
            }
            onContextMenu={(e) => {
              e.preventDefault();
              handleChoiceAnswer({
                question_id: exam_detail.question.id,
                answer_id: answer.id,
                is_answer_draft: true,
              });
            }}
          >
            {choices[idx]}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuestionItem;
