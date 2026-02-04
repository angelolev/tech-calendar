export interface DatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
}

export interface CalendarPopoverProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}
