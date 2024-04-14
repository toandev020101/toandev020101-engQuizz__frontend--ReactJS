import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

const Sidebar = ({ exam_details, scrollToQuestion, noTop = false, showAnswer = false }) => {
  const theme = useTheme();

  return (
    <Box
      padding="20px"
      height="max-content"
      bgcolor={theme.palette.common.white}
      borderRadius="5px"
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      position="sticky"
      top={noTop ? '0' : '76.5px'}
    >
      <Box display={'grid'} gridTemplateColumns={'repeat(5, 1fr)'} gap="10px">
        {exam_details?.map((exam_detail, index) => (
          <Button
            variant={exam_detail.answer_id ? 'contained' : 'outlined'}
            key={`item-${index}`}
            onClick={() => scrollToQuestion(index + 1)}
            sx={{
              '&:hover': showAnswer
                ? {
                    color: exam_detail.answer_id
                      ? theme.palette.common.white
                      : theme.palette.primary.main,
                    bgcolor: exam_detail.answer_id
                      ? showAnswer
                        ? exam_detail.question.answers.find(
                            (answer) => answer.id === exam_detail.answer_id && answer.is_correct,
                          )
                          ? theme.palette.success.light
                          : theme.palette.error.light
                        : exam_detail.is_answer_draft
                        ? theme.palette.warning.main
                        : theme.palette.secondary.main
                      : 'transparent',
                  }
                : {
                    color: exam_detail.answer_id
                      ? theme.palette.common.white
                      : theme.palette.primary.main,
                    bgcolor: exam_detail.answer_id
                      ? exam_detail.is_answer_draft
                        ? theme.palette.warning.main
                        : theme.palette.secondary.main
                      : 'transparent',
                  },

              color: exam_detail.answer_id
                ? theme.palette.common.white
                : theme.palette.primary.main,
              bgcolor: exam_detail.answer_id
                ? showAnswer
                  ? exam_detail.question.answers.find(
                      (answer) => answer.id === exam_detail.answer_id && answer.is_correct,
                    )
                    ? theme.palette.success.light
                    : theme.palette.error.light
                  : exam_detail.is_answer_draft
                  ? theme.palette.warning.main
                  : theme.palette.secondary.main
                : 'transparent',
            }}
          >
            {index + 1}
          </Button>
        ))}
      </Box>

      <Typography marginTop={'20px'} color={theme.palette.warning.main} width="400px">
        * Ghi chú: <br /> + Nhấn chuột trái để lưu đáp án <br /> + Nhấn chuột phải để đánh dấu đáp
        án (nếu nộp bài mà không chỉnh sửa thì tự động lấy đáp án này)
      </Typography>
    </Box>
  );
};

export default Sidebar;
