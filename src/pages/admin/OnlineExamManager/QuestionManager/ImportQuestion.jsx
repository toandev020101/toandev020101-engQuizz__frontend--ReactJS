import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Papa from 'papaparse';
import { Fragment, default as React, useState } from 'react';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BiTrashAlt } from 'react-icons/bi';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TitlePage from '../../../../components/TitlePage';
import * as QuestionApi from '../../../../apis/questionApi';

const ImportQuestion = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [rawQuestions, setRawQuestions] = useState([]);

  const headCells = [
    // các thành phần trên header
    {
      label: 'STT',
      key: 'index',
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
      width: 120,
    },
    {
      label: 'Câu trả lời 1',
      key: 'answer_1',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 2',
      key: 'answer_2',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 3',
      key: 'answer_3',
      numeric: false,
      width: 150,
    },
    {
      label: 'Câu trả lời 4',
      key: 'answer_4',
      numeric: false,
      width: 150,
    },

    {
      label: 'Thao tác',
      numeric: false,
      width: 100,
    },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImportDataUpload(e.dataTransfer.files[0]);
  };

  const handleFileChange = (event) => {
    handleImportDataUpload(event.target.files[0]);
  };

  const handleImportDataUpload = (file) => {
    Papa.parse(file, {
      complete: async (results) => {
        setIsLoading(true);

        // Xử lý dữ liệu ở đây
        const data = [];
        for (let i = 1; i < results.data.length - 1; i++) {
          let question = {};
          for (let j = 0; j < results.data[i].length; j++) {
            if (results.data[0][j] && results.data[0][j] !== '') {
              question[results.data[0][j]] = results.data[i][j] !== '' ? results.data[i][j] : null;
            }
          }
          data.push(question);
        }

        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (
              !data[i].content ||
              data[i].content === data[j].content ||
              (!data[j].answer_1 && !data[j].answer_2)
            ) {
              toast.error('Nhập tệp excel thất bại!', {
                theme: 'colored',
                toastId: 'authId',
                autoClose: 1500,
              });
              setIsLoading(false);
              return;
            }
          }
        }

        if (data.length === 0) {
          toast.error('Nhập tệp excel thất bại!', {
            theme: 'colored',
            toastId: 'authId',
            autoClose: 1500,
          });
        }

        setRawQuestions([...data]);
        setIsLoading(false);
      },
    });
  };

  const handleDeleteRowIndex = (index) => {
    const newRawQuestions = [...rawQuestions];
    newRawQuestions.splice(index, 1);
    setRawQuestions(newRawQuestions);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let values = [];
    rawQuestions.forEach((raw) => {
      const newQuestion = {
        content: raw.content,
        level: raw.level,
        answers: [
          {
            content: raw.answer_1,
            is_correct: parseInt(raw.is_correct) === 1,
          },
          {
            content: raw.answer_2,
            is_correct: parseInt(raw.is_correct) === 2,
          },
          {
            content: raw.answer_3,
            is_correct: parseInt(raw.is_correct) === 3,
          },
          {
            content: raw.answer_4,
            is_correct: parseInt(raw.is_correct) === 4,
          },
        ],
      };

      const newAnswers = [];
      newQuestion.answers.forEach((answer) => {
        if (answer.content) {
          newAnswers.push(answer);
        }
      });

      newQuestion.answers = newAnswers;
      values.push(newQuestion);
    });

    try {
      const res = await QuestionApi.addList(values);

      navigate('/quan-tri/thi-truc-tuyen/cau-hoi', {
        state: {
          notify: {
            type: 'success',
            message: res.detail,
            options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
          },
        },
      });
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

  const handleClose = () => {
    navigate('/quan-tri/thi-truc-tuyen/cau-hoi');
  };

  return (
    <Box
      sx={{
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
        width: '100%',
        bgcolor: theme.palette.common.white,
      }}
    >
      {/* Header */}
      <TitlePage title={'EngQuizz - Nhập câu hỏi từ tệp Excel'} />
      <Typography variant="h6">Nhập câu hỏi từ tệp Excel</Typography>
      <Typography sx={{ color: '#555', fontSize: '14px' }}>
        Quản lý danh sách thông tin câu hỏi và đáp án
      </Typography>
      {/* Header */}

      <Divider sx={{ margin: '20px 0' }} />

      {rawQuestions.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection={'column'}
          alignItems="center"
          color={'#444'}
          width="100%"
          height="100%"
        >
          <Typography sx={{ color: theme.palette.grey[600], fontSize: '25px' }}>
            Tải tệp danh sách câu hỏi
          </Typography>
          <Typography
            sx={{ marginBottom: '30px', marginTop: '2px', color: theme.palette.grey[600] }}
            variant="h6"
          >
            Hãy tải lên tệp excel chứa danh sách câu hỏi đúng định dạng.{' '}
            <Link to="" style={{ textDecoration: 'none' }}>
              Tải tệp excel mẫu tại đây.
            </Link>
          </Typography>

          {/* upload */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="350px"
            width="650px"
            gap="20px"
            margin={'20px 0'}
            sx={{
              border: `2px dashed ${theme.palette.primary.main}`,
              backgroundImage: 'linear-gradient(to bottom, #fdfeff, #eef3fc)',
              borderRadius: '15px',
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FaCloudUploadAlt
              fontSize={'100px'}
              color={theme.palette.primary.main}
              style={{ marginTop: '-10px' }}
            />
            <Typography sx={{ color: '#868694', fontSize: '22px' }}>
              Kéo & thả tệp excel ở đây
            </Typography>
            <Typography sx={{ color: '#868694', fontSize: '22px' }}>Hoặc</Typography>
            <LoadingButton
              variant="contained"
              loading={isLoading}
              startIcon={<AiOutlineFileAdd />}
              loadingPosition="start"
              component="label"
              sx={{
                color: '#fff',
                bgcolor: theme.palette.primary.main,
                borderRadius: '10px',
                fontWeight: 600,
                '&:hover': { color: '#fff', bgcolor: theme.palette.primary.main },
                textTransform: 'none',
              }}
            >
              Chọn tệp excel
              <input hidden onChange={handleFileChange} accept=".csv, .xls, .xlsx" type="file" />
            </LoadingButton>
          </Box>
          {/* upload */}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 500,
            }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
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
              {rawQuestions.map((row, index) => {
                return (
                  <TableRow key={`table-${row.id}`} hover>
                    {headCells.map((headCell, idx) => (
                      <Fragment key={`rowItem-${idx}`}>
                        {headCell.key &&
                          (headCell.key === 'index' ? (
                            <TableCell sx={{ fontSize: '14px' }}>{index + 1}</TableCell>
                          ) : (
                            <>
                              {headCell.key === `answer_${row.is_correct}` ? (
                                <TableCell sx={{ fontSize: '14px' }}>
                                  <Typography
                                    variant="option"
                                    padding="8px 15px"
                                    bgcolor={'#e9ffea'}
                                    border={`1px solid ${theme.palette.success.main}`}
                                    borderRadius={'5px'}
                                    color={theme.palette.success.main}
                                  >
                                    {row[headCell.key]}
                                  </Typography>
                                </TableCell>
                              ) : (
                                <TableCell sx={{ fontSize: '14px' }}>
                                  {row[headCell.key] ? row[headCell.key] : '--'}
                                </TableCell>
                              )}
                            </>
                          ))}
                      </Fragment>
                    ))}
                    <TableCell sx={{ fontSize: '14px' }}>
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
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* table content */}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {rawQuestions.length > 0 && (
        <Box display="flex" justifyContent={'center'} gap="10px" marginTop={'20px'}>
          <LoadingButton
            loading={isLoading}
            loadingIndicator={'Loading...'}
            variant="contained"
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
            }}
            disabled={isLoading}
          >
            Lưu lại
          </LoadingButton>
          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
            }}
            onClick={handleClose}
          >
            Hủy
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImportQuestion;
