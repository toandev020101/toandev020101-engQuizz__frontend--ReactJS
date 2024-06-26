import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { Fragment } from 'react';
import { BiDetail, BiEdit, BiTrashAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import JWTManager from '../../../../utils/jwt';

const TableContent = ({
  rows,
  selectedArr,
  handleSelectAllClick,
  headCells,
  isLoading,
  rowsPerPage,
  isSelected,
  handleRowClick,
  handleDeleteRowIndex,
  handleChangePage,
  handleChangeRowsPerPage,
  total,
  page,
}) => {
  const theme = useTheme();

  const childTableCell = (headCell, row) => {
    if (!headCell.key) return null;

    if (headCell.key.includes('.')) {
      const keys = headCell.key.split('.');
      if (keys[0] === 'result')
        if (row[keys[0]] && row[keys[0]][keys[1]] !== null)
          return (
            <TableCell sx={{ fontSize: '14px' }}>
              {keys[1] === 'score'
                ? row[keys[0]][keys[1]].toFixed(2)
                : `${row[keys[0]][keys[1]]}/${row.exam_details.length}`}
            </TableCell>
          );
        else return <TableCell sx={{ fontSize: '14px' }}>--</TableCell>;
      return (
        <TableCell sx={{ fontSize: '14px' }}>
          {row[keys[0]][keys[1]] ? row[keys[0]][keys[1]] : '--'}
        </TableCell>
      );
    }

    if (headCell.key === 'exam_time')
      return (
        <TableCell sx={{ fontSize: '14px' }}>
          {row[headCell.key] ? `${Math.round(row[headCell.key] / 60)} phút` : '--'}
        </TableCell>
      );

    if (headCell.key === 'is_submitted') {
      const currentDate = new Date();
      const endDate = new Date(row.test.end_date);
      return (
        <TableCell sx={{ fontSize: '14px' }}>
          {row[headCell.key] ? (
            <Typography
              sx={{
                color: theme.palette.success.main,
                border: `1px solid ${theme.palette.success.main}`,
                borderRadius: '3px',
                bgcolor: '#d8f9da',
                fontSize: '14px',
                display: 'inline-block',
                padding: '5px 10px',
              }}
            >
              Đã nộp
            </Typography>
          ) : currentDate < endDate ? (
            <Typography
              sx={{
                color: theme.palette.info.main,
                border: `1px solid ${theme.palette.info.main}`,
                borderRadius: '3px',
                bgcolor: '#def3ff',
                fontSize: '14px',
                display: 'inline-block',
                padding: '5px 10px',
              }}
            >
              Chưa nộp
            </Typography>
          ) : row.exam_time_at ? (
            <Typography
              sx={{
                color: theme.palette.warning.main,
                border: `1px solid ${theme.palette.warning.main}`,
                borderRadius: '3px',
                bgcolor: '#ffedde',
                fontSize: '14px',
                display: 'inline-block',
                padding: '5px 10px',
              }}
            >
              Bỏ thi
            </Typography>
          ) : (
            <Typography
              sx={{
                color: theme.palette.error.main,
                border: `1px solid ${theme.palette.error.main}`,
                borderRadius: '3px',
                bgcolor: '#fbdfdf',
                fontSize: '14px',
                display: 'inline-block',
                padding: '5px 10px',
              }}
            >
              Không thi
            </Typography>
          )}
        </TableCell>
      );
    }

    return (
      <TableCell sx={{ fontSize: '14px' }}>
        {row[headCell.key] ? row[headCell.key] : '--'}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 500,
        }}
        aria-label="custom pagination table"
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedArr.length > 0 && selectedArr.length <= rows.length - 1}
                checked={rows.length > 1 && selectedArr.length === rows.length}
                onChange={handleSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>

            {headCells.map((headCell, id) => (
              <TableCell
                key={`header-cell-item-${id}`}
                align={headCell.numeric ? 'right' : 'left'}
                sx={{ fontSize: '14px' }}
                width={headCell.width}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap="10px"
                  sx={{
                    '&:hover  > div': {
                      opacity: 1,
                      visibility: 'visible',
                    },
                  }}
                >
                  <Typography fontWeight={500}>{headCell.label}</Typography>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {Array(rowsPerPage)
                .fill(0)
                .map((_row, idx) => (
                  <TableRow key={`table-${idx}`}>
                    <TableCell sx={{ fontSize: '14px' }}>
                      <Skeleton variant="rounded" animation="wave" width="18px" height="18px">
                        <Checkbox />
                      </Skeleton>
                    </TableCell>

                    {headCells.map((headCell, i) => (
                      <>
                        {headCell.key && (
                          <TableCell key={`loading-item-${i}`}>
                            {headCell.key !== 'avatar' ? (
                              <Skeleton animation="wave" width="100%">
                                <Typography>{headCell.label}</Typography>
                              </Skeleton>
                            ) : (
                              <Skeleton animation="wave" width="100%" variant="circular">
                                <Avatar>T</Avatar>
                              </Skeleton>
                            )}
                          </TableCell>
                        )}
                      </>
                    ))}

                    <TableCell>
                      <Box display="flex" gap="10px">
                        <Skeleton animation="wave" variant="circular">
                          <IconButton>
                            <BiDetail />
                          </IconButton>
                        </Skeleton>

                        <Skeleton animation="wave" variant="circular">
                          <IconButton>
                            <BiTrashAlt />
                          </IconButton>
                        </Skeleton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </>
          ) : (
            <>
              {/* table content */}
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    key={`table-${row.id}`}
                    onClick={(event) => {
                      if (row.id !== JWTManager.getUserId()) {
                        return handleRowClick(event, row.id);
                      }
                    }}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                    tabIndex={-1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {headCells.map((headCell, idx) => (
                      <Fragment key={`rowItem-${idx}`} sx={{ fontSize: '14px' }}>
                        {childTableCell(headCell, row)}
                      </Fragment>
                    ))}
                    <TableCell sx={{ fontSize: '14px' }}>
                      <Box display="flex" gap="10px">
                        <Tooltip title="Xem chi tiết">
                          <Link to={`/quan-tri/thi-truc-tuyen/bai-thi/${row.id}`}>
                            <IconButton>
                              <BiDetail style={{ color: theme.palette.info.main }} />
                            </IconButton>
                          </Link>
                        </Tooltip>

                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRowIndex(index);
                            }}
                          >
                            <BiTrashAlt
                              style={{
                                color: theme.palette.error.main,
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {rows.length === 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell
                    colSpan={headCells.length + 1}
                    align="center"
                    sx={{ fontSize: '14px' }}
                  >
                    Không có bài thi nào!
                  </TableCell>
                </TableRow>
              )}
              {/* table content */}
            </>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: total > 0 ? total : -1 }]}
              colSpan={headCells.length + 1}
              count={total > 0 ? total : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'Rows per page:',
                },
                native: true,
              }}
              labelRowsPerPage="Số hàng trên mỗi trang"
              labelDisplayedRows={({ from, to }) => `${from}–${to} / ${total}`}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TableContent;
