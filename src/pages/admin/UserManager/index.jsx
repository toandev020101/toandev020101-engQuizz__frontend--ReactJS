import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as UserApi from '../../../apis/userApi';
import RemoveDialog from '../../../components/RemoveDialog';
import TitlePage from '../../../components/TitlePage';
import { useAuthContext } from '../../../contexts/authContext';
import JWTManager from '../../../utils/jwt';
import Header from './Header';
import TableContent from './TableContent';

const UserManager = () => {
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
  const [genderFilter, setGenderFilter] = useState('all');
  const [isAdminFilter, setIsAdminFilter] = useState('all');

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
      label: 'Ảnh đại diện',
      key: 'avatar',
      numeric: false,
      width: 130,
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
      width: 120,
    },
    {
      label: 'Ngày sinh',
      key: 'birth_day',
      numeric: false,
      width: 180,
    },
    {
      label: 'Vai trò',
      key: 'is_admin',
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
        const res = await UserApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
          gender: genderFilter,
          isAdmin: isAdminFilter,
        });

        const { users, total } = res.data;

        if (users.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(users);
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
  }, [page, rowsPerPage, reload, isAuthenticated, navigate, genderFilter, isAdminFilter]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelectedArr = rows.map((row) => {
        if (row.id !== JWTManager.getUserId()) {
          return row.id;
        }
        return undefined;
      });
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
        res = await UserApi.removeAny({ ids: selectedArr });
      } else {
        res = await UserApi.removeOne(rows[deleteRowIndex].id);
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

  const handleChangeIsAdmin = async (e, idx) => {
    e.stopPropagation();
    try {
      const newIsAdmin = e.target.checked;
      const res = await UserApi.changeIsAdmin({ id: rows[idx].id, is_admin: newIsAdmin });
      const newRows = [...rows];
      newRows[idx].is_admin = newIsAdmin;
      setRows(newRows);
      toast.success(res.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
  };

  return (
    <Box>
      <TitlePage title="EngQuizz - Quản lý tài khoản" />
      <Typography sx={{ marginBottom: '20px', fontSize: '18px' }}>Danh sách tài khoản</Typography>
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
              value: genderFilter,
              label: 'Giới tính',
              handleChange: (e) => setGenderFilter(e.target.value),
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'Nam', label: 'Nam' },
                {
                  value: 'Nữ',
                  label: 'Nữ',
                },
              ],
            },
            {
              value: isAdminFilter,
              label: 'Vai trò',
              handleChange: (e) => setIsAdminFilter(e.target.value),
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'true', label: 'Quản trị viên' },
                {
                  value: 'false',
                  label: 'Học viên',
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
          handleChangeIsAdmin={handleChangeIsAdmin}
          total={total}
          page={page}
        />

        <RemoveDialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          title={'Xác nhận xóa tài khoản'}
          content={`Bạn chắc chắn muốn xóa ${
            deleteRowIndex === -1
              ? selectedArr.length + ' tài khoản này'
              : `tài khoản "${rows[deleteRowIndex]?.fullname}"`
          } hay không?`}
          isLoading={isDeleteLoading}
          onConfirm={handleDeleteRow}
        />
      </Box>
      {/* list content */}
    </Box>
  );
};

export default UserManager;
