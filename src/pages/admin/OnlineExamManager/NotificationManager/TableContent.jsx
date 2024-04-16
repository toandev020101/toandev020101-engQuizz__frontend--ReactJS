import {
  Avatar,
  AvatarGroup,
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
import { BiDetail, BiTrashAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import * as settings from '../../../../settings';
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

    if (headCell.key === 'users') {
      return (
        <TableCell sx={{ fontSize: '14px' }}>
          <AvatarGroup max={10} sx={{ justifyContent: 'start' }}>
            {row.notification_details.map((notification_detail) =>
              notification_detail.user.avatar ? (
                <Avatar
                  key={`user-item-${notification_detail.id}`}
                  alt={notification_detail.user.fullname}
                  src={`${settings.SERVER_URL}${notification_detail.user.avatar}`}
                />
              ) : (
                <Avatar>{notification_detail.user.fullname.charAt(0)}</Avatar>
              ),
            )}
          </AvatarGroup>
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
                    Không có thông báo nào!
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
