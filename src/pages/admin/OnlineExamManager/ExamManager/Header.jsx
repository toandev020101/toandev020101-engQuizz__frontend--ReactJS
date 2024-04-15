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
import { PiExport } from 'react-icons/pi';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const Header = ({
  searchTerm,
  handleSearchChange,
  filters,
  selectedArr,
  handleDeleteRowIndex,
  headCells,
  rows,
}) => {
  const [isExportDataLoading, setIsExportDataLoading] = useState(false);

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const exportToExcel = (headExcel, dataExcel) => {
    dataExcel.unshift(headExcel);

    const ws = XLSX.utils.aoa_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách bài thi');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'list_exam.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = (arr) => {
    setIsExportDataLoading(true);
    try {
      delete headCells[headCells.length - 1];
      const headExcel = headCells.map((headCell) => headCell.label);
      const dataExcel = arr.map((row) => {
        const newRow = [];
        headCells.forEach((headCell) => {
          if (headCell.key) {
            if (headCell.key.includes('.')) {
              const keys = headCell.key.split('.');
              if (keys[0] === 'result')
                if (row[keys[0]] && row[keys[0]][keys[1]])
                  newRow.push(
                    keys[1] === 'score'
                      ? row[keys[0]][keys[1]].toFixed(2)
                      : `${row[keys[0]][keys[1]]}/${row.exam_details.length}`,
                  );
                else newRow.push('--');
              else
                newRow.push(row[keys[0]] && row[keys[0]][keys[1]] ? row[keys[0]][keys[1]] : '--');
            } else if (headCell.key === 'exam_time')
              newRow.push(row[headCell.key] ? `${Math.round(row[headCell.key] / 60)} phút` : '--');
            else if (headCell.key === 'is_submitted')
              newRow.push(row[headCell.key] ? 'Đã nộp' : 'Chưa nộp');
            else newRow.push(row[headCell.key] ? row[headCell.key] : '--');
          }
        });
        return newRow;
      });

      exportToExcel(headExcel, dataExcel);
      toast.success('Xuất tệp excel thành công', {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });
    } catch (error) {
      console.log(error);
      toast.error('Xuất tệp excel thất bại!', {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });
    }
    setIsExportDataLoading(false);
  };

  return (
    <Box display="flex" justifyContent="space-between" marginBottom="20px">
      <Box display="flex" alignItems={'center'} gap={'10px'}>
        <TextField
          id="outlined-basic"
          label="Tìm kiếm bài thi"
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

      <LoadingButton
        disabled={rows.length === 0}
        loading={isExportDataLoading}
        loadingPosition="start"
        variant="contained"
        startIcon={<PiExport />}
        sx={{ textTransform: 'inherit' }}
        color="secondary"
        onClick={() => handleExportExcel(rows)}
      >
        Xuất Excel
      </LoadingButton>
    </Box>
  );
};

export default Header;
