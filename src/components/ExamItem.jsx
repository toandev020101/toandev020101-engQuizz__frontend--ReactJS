import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { IoTimeOutline } from 'react-icons/io5';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { LuCalendarCheck } from 'react-icons/lu';
import { GoQuestion } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { dateTimeFullFormat } from '../utils/format';

const ExamItem = ({ exam, type = 'result' }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      borderRadius={'5px'}
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      padding="15px"
      gap="15px"
      minWidth={'450px'}
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
        {(exam?.test.show_result || exam?.test.show_exam || exam?.test.show_answer) && (
          <Link to={`/tai-khoan/bai-thi/${exam?.id}`}>
            <Button variant="contained" sx={{ textTransform: 'none' }} color="secondary">
              Xem chi tiết
            </Button>
          </Link>
        )}
        {type === 'submit' && (
          <Link to="/">
            <Button variant="contained" sx={{ textTransform: 'none' }}>
              Trang chủ
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default ExamItem;
