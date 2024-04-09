import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as TestApi from '../../../../apis/testApi';
import RemoveDialog from '../../../../components/RemoveDialog';
import TitlePage from '../../../../components/TitlePage';
import { useAuthContext } from '../../../../contexts/authContext';
import Header from './Header';
import TableContent from './TableContent';

const TestManager = () => {
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
  const [statusFilter, setStatusFilter] = useState('all');

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
      label: 'Tên',
      key: 'name',
      numeric: false,
      width: 200,
    },
    {
      label: 'Thời gian bắt đầu',
      key: 'start_date',
      numeric: false,
    },
    {
      label: 'Thời gian kết thúc',
      key: 'end_date',
      numeric: false,
    },
    {
      label: 'Thời gian làm bài',
      key: 'exam_time',
      numeric: false,
      width: 180,
    },
    {
      label: 'Trạng thái',
      key: 'status',
      numeric: false,
      width: 120,
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
        const res = await TestApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
          status: statusFilter,
        });

        const { tests, total } = res.data;

        if (tests.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(tests);
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
  }, [page, rowsPerPage, reload, isAuthenticated, navigate, statusFilter]);

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
        res = await TestApi.removeList({ ids: selectedArr });
      } else {
        res = await TestApi.removeOne(rows[deleteRowIndex].id);
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
      <TitlePage title="EngQuizz - Quản lý đề thi" />
      <Typography sx={{ marginBottom: '20px', fontSize: '18px' }}>Danh sách đề thi</Typography>
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
          searchTitle="Tìm kiếm đề thi"
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          filters={[
            {
              value: statusFilter,
              label: 'Trạng thái',
              handleChange: (e) => setStatusFilter(e.target.value),
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'Chưa mở', label: 'Chưa mở' },
                {
                  value: 'Đang mở',
                  label: 'Đang mở',
                },
                {
                  value: 'Đã đóng',
                  label: 'Đã đóng',
                },
              ],
            },
          ]}
          selectedArr={selectedArr}
          handleDeleteRowIndex={handleDeleteRowIndex}
          addLinkTo="/quan-tri/thi-truc-tuyen/de-thi/them-moi"
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
          title={'Xác nhận xóa đề thi'}
          content={`Bạn chắc chắn muốn xóa ${
            deleteRowIndex === -1
              ? selectedArr.length + ' đề thi này'
              : `đề thi "${rows[deleteRowIndex]?.content}"`
          } hay không?`}
          isLoading={isDeleteLoading}
          onConfirm={handleDeleteRow}
        />
      </Box>
      {/* list content */}
    </Box>
  );
};

export default TestManager;
