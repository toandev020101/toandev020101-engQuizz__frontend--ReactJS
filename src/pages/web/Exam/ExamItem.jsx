import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import { dateTimeFullFormat } from '../../../utils/format';
import { Link } from 'react-router-dom';

const ExamItem = ({ item }) => {
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
      height={'300px'}
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      padding="15px"
    >
      <Typography variant="h6" marginBottom={'10px'}>
        {item.test.name}
      </Typography>
      <Typography color={theme.palette.primary.main} marginBottom={'50px'}>
        {item.test.exam_time / 60} phút
      </Typography>
      <Typography marginBottom={'5px'}>
        Bắt đầu: {dateTimeFullFormat(item.test.start_date)}
      </Typography>
      <Typography marginBottom={'50px'}>
        Kết thúc: {dateTimeFullFormat(item.test.end_date)}
      </Typography>

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
          <Link to={`/bai-thi/thi-truc-tuyen/${item.id}`}>
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

export default ExamItem;
