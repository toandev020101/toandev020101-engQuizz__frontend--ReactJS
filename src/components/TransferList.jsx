import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';

const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

const union = (a, b) => {
  return [...a, ...not(b, a)];
};

const TransferList = ({
  type,
  list,
  checked,
  setChecked,
  left,
  setLeft,
  right,
  setRight,
  easyQuantity = 0,
  averageQuantity = 0,
  difficultQuantity = 0,
}) => {
  const theme = useTheme();
  const levels = [
    {
      name: 'Dễ',
      color: theme.palette.success.main,
      bgcolor: '#ebffec',
    },
    {
      name: 'Trung bình',
      color: theme.palette.warning.main,
      bgcolor: '#ffefe1',
    },
    {
      name: 'Khó',
      color: theme.palette.error.main,
      bgcolor: '#ffdede',
    },
  ];

  const [leftSearchTerm, setLeftSearchTerm] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');

  const [easyCurrent, setEasyCurrent] = useState(0);
  const [averageCurrent, setAverageCurrent] = useState(0);
  const [difficultCurrent, setDifficultCurrent] = useState(0);

  useEffect(() => {
    if (type !== 'user') {
      let newEasyCurrent = 0;
      let newAverageCurrent = 0;
      let newDifficultCurrent = 0;

      right.forEach((item) => {
        if (list[item].level === 'Dễ') newEasyCurrent++;
        else if (list[item].level === 'Trung bình') newAverageCurrent++;
        else if (list[item].level === 'Khó') newDifficultCurrent++;
      });

      setEasyCurrent(newEasyCurrent);
      setAverageCurrent(newAverageCurrent);
      setDifficultCurrent(newDifficultCurrent);
    }
  }, [list, right]);

  const selectColor = (key) => {
    let color = '';
    levels.forEach((level) => {
      if (level.name === key) {
        color = level.color;
      }
    });

    return color;
  };

  const selectBgColor = (key) => {
    let bgcolor = '';
    levels.forEach((level) => {
      if (level.name === key) {
        bgcolor = level.bgcolor;
      }
    });

    return bgcolor;
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    if (type !== 'user') {
      let easyChecked = 0;
      let averageChecked = 0;
      let difficultChecked = 0;

      leftChecked.forEach((item) => {
        if (list[item].level === 'Dễ') easyChecked++;
        else if (list[item].level === 'Trung bình') averageChecked++;
        else difficultChecked++;
      });

      if (
        easyChecked + easyCurrent > easyQuantity ||
        averageChecked + averageCurrent > averageQuantity ||
        difficultChecked + difficultCurrent > difficultQuantity
      ) {
        toast.error('Số câu hỏi không hợp lệ!', {
          theme: 'colored',
          toastId: 'headerId',
          autoClose: 1500,
        });
        return;
      } else {
        setEasyCurrent(easyCurrent + easyChecked);
        setAverageCurrent(averageCurrent + averageChecked);
        setDifficultCurrent(difficultCurrent + difficultChecked);
      }
    }

    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    if (type !== 'user') {
      let easyChecked = 0;
      let averageChecked = 0;
      let difficultChecked = 0;

      rightChecked.forEach((item) => {
        if (list[item].level === 'Dễ') easyChecked++;
        else if (list[item].level === 'Trung bình') averageChecked++;
        else difficultChecked++;
      });

      setEasyCurrent(easyCurrent - easyChecked);
      setAverageCurrent(averageCurrent - averageChecked);
      setDifficultCurrent(difficultCurrent - difficultChecked);
    }

    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (table, title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
      />
      <Divider />
      <Box margin="10px 20px" position="relative">
        <TextField
          size="small"
          fullWidth
          value={table === 'left' ? leftSearchTerm : rightSearchTerm}
          onChange={(e) => {
            if (table === 'left') {
              setLeftSearchTerm(e.target.value);
            } else {
              setRightSearchTerm(e.target.value);
            }
          }}
        />
        <BiSearchAlt
          fontSize={'22px'}
          color={theme.palette.grey[600]}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        />
      </Box>
      {type !== 'user' && table === 'right' && (
        <Box display="flex" gap="10px" justifyContent={'center'}>
          {levels.map((level) => (
            <Typography
              key={level.name}
              fontSize={'13px'}
              sx={{
                padding: '2px 10px',
                border: `1px solid ${selectColor(level.name)}`,
                borderColor: selectColor(level.name),
                color: selectColor(level.name),
                bgcolor: selectBgColor(level.name),
                borderRadius: '3px',
              }}
            >
              {level.name}{' '}
              {level.name === 'Dễ'
                ? `(${easyCurrent}/${easyQuantity})`
                : level.name === 'Trung bình'
                ? `(${averageCurrent}/${averageQuantity})`
                : `(${difficultCurrent}/${difficultQuantity})`}
            </Typography>
          ))}
        </Box>
      )}
      <List
        sx={{
          width: 380,
          height: type === 'user' ? 300 : 800,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          const content =
            type === 'user'
              ? `${list[value].fullname} (${list[value].email})`
              : list[value].content;

          if (
            content
              .toLowerCase()
              .includes(
                table === 'left' ? leftSearchTerm.toLowerCase() : rightSearchTerm.toLowerCase(),
              )
          )
            return (
              <ListItemButton key={value} role="listitem" onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                {type === 'user' ? (
                  <ListItemText id={labelId} primary={content} />
                ) : (
                  <Box display="flex" gap="5px" flexWrap={'wrap'}>
                    <Typography>{content}</Typography>
                    <Typography
                      fontSize={'13px'}
                      sx={{
                        padding: '2px 10px',
                        border: `1px solid ${selectColor(list[value].level)}`,
                        borderColor: selectColor(list[value].level),
                        color: selectColor(list[value].level),
                        bgcolor: selectBgColor(list[value].level),
                        borderRadius: '3px',
                      }}
                    >
                      {list[value].level}
                    </Typography>
                  </Box>
                )}
              </ListItemButton>
            );

          return null;
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('left', type === 'user' ? 'Học viên' : 'Câu hỏi', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('right', type === 'user' ? 'Học viên' : 'Câu hỏi', right)}</Grid>
    </Grid>
  );
};

export default TransferList;
