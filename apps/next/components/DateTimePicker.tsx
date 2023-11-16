import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import React from 'react';

interface DateTimePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'datetime';
  [key: string]: any;
}

const DateTimePicker = ({
  date,
  onChange,
  mode = 'date',
  ...props
}: DateTimePickerProps) => (
  <ReactDatePicker
    selected={date}
    onChange={onChange}
    showTimeSelect={mode === 'datetime'}
    dateFormat={mode === 'datetime' ? 'Pp' : 'P'}
    {...props}
  />
);

export default DateTimePicker
