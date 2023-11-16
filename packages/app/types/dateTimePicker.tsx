export interface DateTimePickerProps {
  date: Date
  onChange: any
  mode?: 'date' | 'datetime'
  [key: string]: any
}

export type CrossPlatformDateTimePicker = ({
  date,
  onChange,
  mode,
  ...props
}: DateTimePickerProps) => JSX.Element
