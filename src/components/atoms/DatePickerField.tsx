import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { CalendarMonth } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

interface DatePickerFieldProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  name?: string;
  className?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disableFuture?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const StyledCalendarIcon = styled(CalendarMonth)(() => ({
  color: "white",
}));

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  name,
  className,
  required = false,
  minDate,
  maxDate,
  disableFuture = false,
  backgroundColor = "var(--color-primary)",
  borderColor,
  size = "small",
  error = false,
  helperText = "",
  disabled,
}) => {
  return (
    <DatePicker
      format="dd/MM/yyy"
      value={value}
      onChange={onChange}
      disableFuture={disableFuture}
      minDate={minDate}
      maxDate={maxDate}
      label={label}
      slots={{
        openPickerIcon: StyledCalendarIcon,
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          size,
          required,
          name,
          className,
          error,
          helperText,
          disabled,
          InputLabelProps: {
            sx: {
              color: "var(--color-secondary-txt)",
            },
          },
          InputProps: {
            sx: {
              backgroundColor,
              borderColor,
              borderRadius: "4px",
              color: "var(--color-primary-txt)",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-primary)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-secondary-txt)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-neutral)",
              },
            },
          },
        },
      }}
    />
  );
};

export default DatePickerField;
