import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

interface DateTimePickerProps {
  date: Date
  onChange: (date: Date | undefined) => void
  mode?: 'date' | 'datetime'
  [key: string]: any
}

const MyDateTimePicker = ({ date, onChange,  mode = 'date', ...props }: DateTimePickerProps) => (
  <DateTimePicker
    value={date}
    mode={mode as 'date' | 'datetime' | 'time'} // Ensure mode is one of the allowed values
    onChange={(event, value) => onChange(value)}
    {...props}
  />
)

export default MyDateTimePicker
