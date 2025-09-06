import React, { forwardRef } from "react";
import { TextField } from "@mui/material";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  className?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  multiline?: boolean;
  rows?: number;
  backgroundColor?: string;
  borderColor?: string;
  hideLabel?: boolean;
  inputProps?: Record<string, any>;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  numberOnly?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      type = "text",
      value,
      className,
      placeholder,
      onChange,
      required = false,
      fullWidth = true,
      variant = "outlined",
      multiline = false,
      rows,
      backgroundColor = "var(--color-primary)",
      borderColor,
      hideLabel = false,
      inputProps = {},
      size = "small",
      error = false,
      helperText = "",
      disabled,
      numberOnly = false,
    },
    ref, // <-- receive ref here
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (numberOnly) {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        e.target.value = onlyNumbers;
      }
      onChange(e);
    };

    return (
      <TextField
        fullWidth={fullWidth}
        variant={variant}
        name={name}
        type={type}
        label={hideLabel ? undefined : label}
        value={value}
        className={className}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        size={size}
        error={error}
        helperText={helperText}
        disabled={disabled}
        // 👇 attach ref here
        inputRef={ref}
        inputProps={{
          inputMode: numberOnly ? "numeric" : undefined,
          ...inputProps,
        }}
        InputLabelProps={{
          sx: {
            color: "var(--color-secondary-txt)",
          },
        }}
        InputProps={{
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
          ...inputProps,
        }}
      />
    );
  },
);

export default InputField;
