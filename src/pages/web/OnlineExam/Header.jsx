import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { FaPowerOff } from 'react-icons/fa6';
import { RiTimerFlashLine } from 'react-icons/ri';
import { LuUpload } from 'react-icons/lu';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, timeDown, isLoading, handleExit, handleSubmit }) => {
  const theme = useTheme();

  const [timeStr, setTimeStr] = useState(null);
  const [openExitDialog, setExitOpenDialog] = useState(false);
  const [openSubmitDialog, setSubmitOpenDialog] = useState(false);

  useEffect(() => {
    const milliseconds = timeDown * 1000;
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    setTimeStr(`${hoursStr}:${minutesStr}:${secondsStr}`);
  }, [timeDown]);

  return (
    <Box
      padding="10px 150px"
      display="flex"
      justifyContent={'space-between'}
      alignItems={'center'}
      position="sticky"
      top={0}
      bgcolor={theme.palette.common.white}
    >
      <Button
        variant="contained"
        color="warning"
        startIcon={<FaPowerOff />}
        sx={{ textTransform: 'none' }}
        onClick={() => setExitOpenDialog(true)}
      >
        Thoát
      </Button>

      <ConfirmDialog
        open={openExitDialog}
        onClose={() => setExitOpenDialog(false)}
        title={'Xác nhận thoát'}
        content={'Bạn vẫn chưa nộp bài, có chắc chắn muốn thoát hay không ?'}
        isLoading={isLoading}
        onConfirm={handleExit}
      />

      <Typography fontWeight={600}>Học viên: {user?.fullname}</Typography>

      <Box display="flex" alignItems={'center'} gap="30px">
        <Box display="flex" alignItems={'center'} gap="5px">
          <RiTimerFlashLine fontSize={'22px'} />
          <Typography fontWeight={600}>{timeStr}</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<LuUpload />}
          sx={{ textTransform: 'none' }}
          onClick={() => setSubmitOpenDialog(true)}
        >
          Nộp bài
        </Button>

        <ConfirmDialog
          open={openSubmitDialog}
          onClose={() => setSubmitOpenDialog(false)}
          title={'Xác nhận nộp bài'}
          content={'Bạn có chắc chắn muốn nộp bài hay không ?'}
          isLoading={isLoading}
          onConfirm={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default Header;
