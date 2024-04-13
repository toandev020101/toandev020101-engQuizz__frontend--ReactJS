import { Box, useTheme } from '@mui/material';
import React from 'react';

const Result = () => {
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.common.white}
      boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
      borderRadius={'5px'}
    ></Box>
  );
};

export default Result;
