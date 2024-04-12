import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaPowerOff } from 'react-icons/fa6';
import { LuUpload } from 'react-icons/lu';
import { RiTimerFlashLine } from 'react-icons/ri';

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

      <Dialog
        open={openExitDialog}
        onClose={() => setExitOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          Thông báo thoát
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
            <FaPowerOff fontSize={'80px'} color={theme.palette.warning.main} />
            <Typography color={theme.palette.error.main} fontSize="20px">
              Bạn vẫn chưa nộp bài.
            </Typography>
            <Typography>Bạn có chắc chắn muốn thoát hay không ?</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
            gap: '5px',
          }}
        >
          <LoadingButton
            loading={isLoading}
            loadingIndicator={'Loading...'}
            variant="contained"
            type="submit"
            sx={{
              textTransform: 'inherit',
            }}
            disabled={isLoading}
            onClick={async () => {
              await handleExit();
              setExitOpenDialog(false);
            }}
          >
            Xác nhận
          </LoadingButton>

          <Button
            variant={'contained'}
            onClick={() => setExitOpenDialog(false)}
            color="error"
            sx={{
              textTransform: 'capitalize',
            }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

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

        <Dialog
          open={openSubmitDialog}
          onClose={() => setSubmitOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
            Thông báo nộp bài
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
              <LuUpload fontSize={'80px'} color={theme.palette.success.main} />
              <Typography color={theme.palette.success.main} fontSize="20px">
                Hoàn thành bài thi.
              </Typography>
              <Typography>Bạn có chắc chắn muốn nộp bài hay không ?</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px',
              gap: '5px',
            }}
          >
            <LoadingButton
              loading={isLoading}
              loadingIndicator={'Loading...'}
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'inherit',
              }}
              disabled={isLoading}
              onClick={async () => {
                await handleSubmit();
                setSubmitOpenDialog(false);
              }}
            >
              Xác nhận
            </LoadingButton>

            <Button
              variant={'contained'}
              onClick={() => setSubmitOpenDialog(false)}
              color="error"
              sx={{
                textTransform: 'capitalize',
              }}
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Header;
