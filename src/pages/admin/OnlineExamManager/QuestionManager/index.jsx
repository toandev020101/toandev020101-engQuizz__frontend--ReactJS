import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as QuestionApi from '../../../../apis/questionApi';
import RemoveDialog from '../../../../components/RemoveDialog';
import TitlePage from '../../../../components/TitlePage';
import { useAuthContext } from '../../../../contexts/authContext';
import JWTManager from '../../../../utils/jwt';
import Header from './Header';
import TableContent from './TableContent';

const QuestionManager = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedArr, setSelectedArr] = useState([]);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [levelFilter, setLevelFilter] = useState('all');

  const { isAuthenticated } = useAuthContext();

  const headCells = [
    // các thành phần trên header
    {
      label: 'ID',
      key: 'id',
      numeric: false,
      width: 60,
    },
    {
      label: 'Nội dung',
      key: 'content',
      numeric: false,
    },
    {
      label: 'Độ khó',
      key: 'level',
      numeric: false,
      width: 100,
    },
    {
      label: 'Câu trả lời 1',
      key: 'content_1',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 2',
      key: 'content_2',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 3',
      key: 'content_3',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 4',
      key: 'content_4',
      numeric: false,
      width: 150,
    },

    {
      label: 'Thao tác',
      numeric: false,
      width: 120,
    },
  ];

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách rows
    setSelectedArr([]);

    const getPagination = async () => {
      setIsLoading(true);
      try {
        const res = await QuestionApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
          level: levelFilter,
        });

        const { questions, total } = res.data;

        if (questions.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(questions);
        setTotal(total);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
      setIsLoading(false);
    };

    if (isAuthenticated) {
      getPagination();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, reload, isAuthenticated, navigate, levelFilter]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelectedArr = rows.map((row) => row.id);
      newSelectedArr = newSelectedArr.filter((selected) => selected !== undefined);
      setSelectedArr(newSelectedArr);
      return;
    }
    setSelectedArr([]);
  };

  const handleRowClick = (_event, id) => {
    const selectedIndex = selectedArr.indexOf(id);
    let newSelectedArr = [];

    if (selectedIndex === -1) {
      newSelectedArr = newSelectedArr.concat(selectedArr, id);
    } else if (selectedIndex === 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(1));
    } else if (selectedIndex === selectedArr.length - 1) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedArr = newSelectedArr.concat(
        selectedArr.slice(0, selectedIndex),
        selectedArr.slice(selectedIndex + 1),
      );
    }
    setSelectedArr(newSelectedArr);
  };

  const isSelected = (id) => selectedArr.indexOf(id) !== -1;

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRowIndex = (index) => {
    setDeleteRowIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    try {
      let res;
      if (deleteRowIndex === -1) {
        res = await QuestionApi.removeList({ ids: selectedArr });
      } else {
        res = await QuestionApi.removeOne(rows[deleteRowIndex].id);
      }

      toast.success(res.detail, {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });

      setReload(!reload);
      setSelectedArr([]);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
    setIsDeleteLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setReload(!reload);
      setPage(0);
    }, 500);
  };

  return (
    <Box>
      <TitlePage title="EngQuizz - Quản lý câu hỏi" />
      <Typography sx={{ marginBottom: '20px', fontSize: '18px' }}>Danh sách câu hỏi</Typography>
      {/* list content */}
      <Box
        padding="20px"
        marginBottom="30px"
        sx={{
          bgcolor: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 3px',
          borderRadius: '5px',

          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              fontSize: '16px',
            },
          },
          '& label.Mui-focused': {
            fontSize: '16px',
          },
        }}
      >
        <Header
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          filters={[
            {
              value: levelFilter,
              label: 'Độ khó',
              handleChange: (e) => setLevelFilter(e.target.value),
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'Dễ', label: 'Dễ' },
                {
                  value: 'Trung bình',
                  label: 'Trung bình',
                },
                {
                  value: 'Khó',
                  label: 'Khó',
                },
              ],
            },
          ]}
          selectedArr={selectedArr}
          handleDeleteRowIndex={handleDeleteRowIndex}
        />

        <TableContent
          rows={rows}
          selectedArr={selectedArr}
          handleSelectAllClick={handleSelectAllClick}
          headCells={headCells}
          isLoading={isLoading}
          rowsPerPage={rowsPerPage}
          isSelected={isSelected}
          handleRowClick={handleRowClick}
          handleDeleteRowIndex={handleDeleteRowIndex}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          total={total}
          page={page}
        />

        <RemoveDialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          title={'Xác nhận xóa câu hỏi'}
          content={`Bạn chắc chắn muốn xóa ${
            deleteRowIndex === -1
              ? selectedArr.length + ' câu hỏi này'
              : `câu hỏi "${rows[deleteRowIndex]?.content}"`
          } hay không?`}
          isLoading={isDeleteLoading}
          onConfirm={handleDeleteRow}
        />
      </Box>
      {/* list content */}
    </Box>
  );
};

export default QuestionManager;
