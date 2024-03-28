import { Box, Dialog, DialogContent, DialogTitle, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RemoveDialog from '../../../components/RemoveDialog';

const AddOrEditDialog = ({ form, openDialog, handleClose, handleSubmit }) => {
  const theme = useTheme();
  const [text, setText] = useState(null);
  const [rows, setRows] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(-1);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const headCells = [
    // các thành phần trên header
    {
      label: 'STT', // chữ hiển thị
      key: 'stt',
      numeric: false, // là chữ số
      width: 60, // độ rộng của cột
    },
    {
      label: 'Họ và tên',
      key: 'fullname',
      numeric: false,
      width: 120,
    },
    {
      label: 'Email',
      key: 'email',
      numeric: false,
      width: 150,
    },
    {
      label: 'Giới tính',
      key: 'gender',
      numeric: false,
      width: 150,
    },
    {
      label: 'Ngày sinh',
      key: 'birth_day',
      numeric: false,
      width: 150,
    },
    {
      label: 'Địa chỉ',
      key: 'address',
      numeric: false,
      width: 150,
    },
    {
      label: 'Vai trò',
      key: 'role',
      numeric: false,
      width: 120,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  useEffect(() => {
    let newText = text;
    if (openDialog === 'add') {
      newText = 'Thêm mới';
    } else if (openDialog === 'edit') {
      newText = 'Chỉnh sửa';
    }

    setText(newText);
    // eslint-disable-next-line
  }, [openDialog]);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRowIndex = (index) => {
    setOpenDeleteDialog(true);
    setDeleteRowIndex(index);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRow = () => {
    setIsDeleteLoading(true);
    rows.splice(deleteRowIndex, 1);
    setRows(rows);
    setIsDeleteLoading(false);
  };

  return (
    <Box width={'100%'}>
      <Dialog
        open={!!openDialog}
        onClose={() => {
          handleClose();
          setRows([]);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': { maxWidth: '1200px', minWidth: '400px', width: 'max-content' },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          {text} người dùng
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} margin="10px 0"></Box>
        </DialogContent>
      </Dialog>

      <RemoveDialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        title={'Xác nhận xóa người dùng'}
        content={`Bạn chắc chắn muốn xóa người dùng ${rows[deleteRowIndex]?.fullname} hay không?`}
        isLoading={isDeleteLoading}
        onConfirm={handleDeleteRow}
      />
    </Box>
  );
};

export default AddOrEditDialog;
