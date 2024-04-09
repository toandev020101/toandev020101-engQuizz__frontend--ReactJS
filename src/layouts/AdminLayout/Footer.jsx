import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  return (
    <Box textAlign={'center'} width={'100%'}>
      <Typography fontSize="16px" sx={{ color: theme.palette.grey[700], textAlign: 'center' }}>
        &copy; 2023 lập trình bởi Nhóm 4 - EngQuizz
      </Typography>
    </Box>
  );
};

export default Footer;
