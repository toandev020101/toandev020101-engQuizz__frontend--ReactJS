import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { BiSearchAlt, BiTrashAlt } from 'react-icons/bi';
import { FiPlusSquare } from 'react-icons/fi';
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ searchTerm, handleSearchChange, filters, selectedArr, handleDeleteRowIndex }) => {
  return (
    <Box display="flex" justifyContent="space-between" marginBottom="20px">
      <Box display="flex" alignItems={'center'} gap={'10px'}>
        <TextField
          id="outlined-basic"
          label="Tìm kiếm câu hỏi"
          variant="outlined"
          size="small"
          sx={{ width: '250px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <BiSearchAlt fontSize="20px" />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {filters.map((filter, index) => (
          <Box key={`filter-item-${index}`} minWidth={'150px'}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">{filter.label}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter.value}
                label={filter.label}
                onChange={filter.handleChange}
              >
                {filter.options.map((option, idx) => (
                  <MenuItem key={`option-item-${idx}`} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}

        {selectedArr.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<BiTrashAlt />}
            sx={{
              textTransform: 'capitalize',
            }}
            onClick={() => handleDeleteRowIndex(-1)}
          >
            Xóa ({selectedArr.length})
          </Button>
        )}
      </Box>

      <Box display={'flex'} gap={'10px'}>
        <Link to={'/quan-tri/thi-truc-tuyen/cau-hoi/them-moi'}>
          <Button
            variant="contained"
            startIcon={<FiPlusSquare />}
            sx={{ textTransform: 'inherit' }}
          >
            Thêm mới
          </Button>
        </Link>

        <Link to={'/quan-tri/thi-truc-tuyen/cau-hoi/nhap-tep'}>
          <Button
            variant="contained"
            startIcon={<FiPlusSquare />}
            sx={{ textTransform: 'inherit', bgcolor: '#9c27b0', '&:hover': { bgcolor: '#821895' } }}
          >
            Nhập từ tệp
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Header;
