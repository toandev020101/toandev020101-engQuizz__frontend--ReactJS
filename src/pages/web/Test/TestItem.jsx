import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import { LuCalendarCheck, LuCalendarOff } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { dateTimeFullFormat } from '../../../utils/format';
import { GoQuestion } from 'react-icons/go';

const TestItem = ({ item }) => {
  const theme = useTheme();
  const [timeDown, setTimeDown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startDate = new Date(item.test.start_date).getTime();
      const newTimeDown = startDate - now;

      if (newTimeDown > 0) {
        setTimeDown(newTimeDown);
      } else {
        clearInterval(interval);
        setTimeDown(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [item]);

  const formatTimeDown = () => {
    const days = Math.floor(timeDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDown % (1000 * 60)) / 1000);

    const daysStr = String(days).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    if (days > 0) {
      return `Mở sau ${daysStr} ngày ${hoursStr} giờ`;
    } else if (hours > 0) {
      return `Mở sau ${hoursStr} giờ ${minutesStr} phút`;
    } else if (minutes > 0) {
      return `Mở sau ${minutesStr} phút ${secondsStr} giây`;
    } else {
      return `Mở sau ${secondsStr} giây`;
    }
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      borderRadius={'5px'}
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      padding="15px"
      gap="15px"
    >
      <Typography variant="h6" marginBottom={'10px'}>
        {item.test.name}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" alignItems="center" gap="5px">
          <IoTimeOutline fontSize={'25px'} />
          <Typography>Thời gian làm bài</Typography>
        </Box>
        <Typography>{item.test.exam_time / 60} phút</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" alignItems="center" gap="5px">
          <LuCalendarCheck fontSize={'24px'} />
          <Typography>Thời gian mở đề</Typography>
        </Box>
        <Typography>{dateTimeFullFormat(item.test.start_date)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" alignItems="center" gap="5px">
          <LuCalendarOff fontSize={'24px'} />
          <Typography>Thời gian kết thúc</Typography>
        </Box>
        <Typography>{dateTimeFullFormat(item.test.end_date)}</Typography>
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
          <Typography>Số lượng câu hỏi</Typography>
        </Box>
        <Typography>{item.exam_details.length}</Typography>
      </Box>

      {timeDown > 0 ? (
        <Typography
          sx={{
            border: `1px solid ${theme.palette.warning.main}`,
            borderRadius: '3px',
            bgcolor: '#fdebdc',
            color: theme.palette.warning.main,
            display: 'inline-block',
            padding: '5px 20px',
            fontSize: '15px',
          }}
        >
          {formatTimeDown()}
        </Typography>
      ) : new Date() - new Date(item.test.end_date) < 0 ? (
        item.is_submitted ? (
          <Typography
            sx={{
              border: `1px solid ${theme.palette.success.main}`,
              borderRadius: '3px',
              bgcolor: '#e2ffe4',
              color: theme.palette.success.main,
              display: 'inline-block',
              width: '150px',
              height: '36px',
              lineHeight: '36px',
              textAlign: 'center',
              fontSize: '15px',
            }}
          >
            Đã nộp
          </Typography>
        ) : (
          <Link to={`/de-thi/thi-truc-tuyen/${item.id}`}>
            <Button variant="contained" sx={{ minWidth: '150px', textTransform: 'none' }}>
              Vào thi
            </Button>
          </Link>
        )
      ) : (
        <Typography
          sx={{
            border: `1px solid ${theme.palette.error.main}`,
            borderRadius: '3px',
            bgcolor: '#fbdfdf',
            color: theme.palette.error.main,
            display: 'inline-block',
            width: '150px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            fontSize: '15px',
          }}
        >
          Kết thúc
        </Typography>
      )}
    </Box>
  );
};

export default TestItem;
