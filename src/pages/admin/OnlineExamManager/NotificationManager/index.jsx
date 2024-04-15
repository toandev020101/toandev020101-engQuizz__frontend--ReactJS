import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as NotificationApi from '../../../../apis/notificationApi';
import RemoveDialog from '../../../../components/RemoveDialog';
import TitlePage from '../../../../components/TitlePage';
import { useAuthContext } from '../../../../contexts/authContext';
import Header from './Header';
import TableContent from './TableContent';

const NotificationManager = () => {
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
      label: 'Tiêu đề',
      key: 'title',
      numeric: false,
    },
    {
      label: 'Nội dung',
      key: 'content',
      numeric: false,
    },
    {
      label: 'Học viên',
      key: 'users',
      numeric: false,
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
        const res = await NotificationApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
        });

        const { notifications, total } = res.data;

        if (notifications.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(notifications);
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
  }, [page, rowsPerPage, reload, isAuthenticated, navigate]);

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
        res = await NotificationApi.removeList({ ids: selectedArr });
      } else {
        res = await NotificationApi.removeOne(rows[deleteRowIndex].id);
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
      <TitlePage title="EngQuizz - Quản lý thông báo" />
      <Typography sx={{ marginBottom: '20px', fontSize: '18px' }}>Danh sách thông báo</Typography>
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
          filters={[]}
          selectedArr={selectedArr}
          handleDeleteRowIndex={handleDeleteRowIndex}
          headCells={headCells}
          rows={rows.filter((row, index) => selectedArr.includes(row.id))}
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
          title={'Xác nhận xóa thông báo'}
          content={`Bạn chắc chắn muốn xóa ${
            deleteRowIndex === -1
              ? selectedArr.length + ' thông báo này'
              : `thông báo "${rows[deleteRowIndex]?.title}"`
          } hay không?`}
          isLoading={isDeleteLoading}
          onConfirm={handleDeleteRow}
        />
      </Box>
      {/* list content */}
    </Box>
  );
};

export default NotificationManager;
