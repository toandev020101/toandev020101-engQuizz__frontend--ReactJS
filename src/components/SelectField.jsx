import { FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const SelectField = ({
  form,
  label,
  name,
  valueObjects,
  maxWidth,
  onHandleChange,
  required,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, error: errorClient },
      }) => (
        <FormControl
          fullWidth
          sx={{
            maxWidth,
          }}
        >
          <InputLabel id={`demo-simple-select-${label}`}>
            {label}
            {required ? ' *' : ''}
          </InputLabel>

          <Select
            labelId={`demo-simple-select-${label}`}
            id={`demo-simple-${label}`}
            value={value}
            label={label}
            name={name}
            onChange={onChange} // send value to hook form
            onBlur={onBlur}
            ref={ref}
            {...props}
          >
            {valueObjects.map((valueObject, index) => (
              <MenuItem key={`select-${index}`} value={valueObject.value}>
                {valueObject.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ fontSize: '14px' }}>{errorClient?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
