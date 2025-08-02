import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface DropdownFieldProps {
  label?: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";
  backgroundColor?: string;
  borderColor?: string;
  selectProps?: Record<string, any>;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  options,
  required = false,
  fullWidth = true,
  variant = "outlined",
  size = "small",
  backgroundColor = "var(--color-primary)",
  borderColor,
  selectProps = {},
}) => {
  return (
    <FormControl fullWidth={fullWidth} required={required} variant={variant} size={size}>
      {label && <InputLabel sx={{ color: "var(--color-secondary-txt)" }}>{label}</InputLabel>}
      <Select
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        sx={{
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
          "& .MuiSelect-icon": {
            color: "var(--color-primary-txt)",
          },
        }}
        {...selectProps}
      >
        <MenuItem value="" disabled>
          {placeholder || `Select ${label}`}
        </MenuItem>
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownField;
