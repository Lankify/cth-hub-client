import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Box,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Option {
  _id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  multiple?: boolean;
  size?: "small" | "medium";
  minWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  multiple = true,
  size = "small",
  minWidth = 200,
  backgroundColor = "var(--color-primary)",
  borderColor = "var(--color-secondary-txt)",
}) => {
  const handleDelete = (id: string) => {
    onChange(value.filter(v => v !== id));
  };

  return (
    <FormControl size={size} style={{ minWidth }}>
      <InputLabel
        sx={{
          color: "var(--color-secondary-txt)",
          "&.Mui-focused": {
            color: "var(--color-neutral)",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        multiple={multiple}
        value={value}
        onChange={e => onChange(e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        sx={{
          backgroundColor,
          borderRadius: "4px",
          color: "var(--color-primary-txt)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary-txt)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-neutral)",
          },
          "& .MuiSelect-icon": {
            color: "var(--color-primary-txt)",
          },
        }}
        renderValue={selected => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(selected as string[]).map(id => {
              const option = options.find(o => o._id === id);
              return (
                <Chip
                  key={id}
                  label={option?.name}
                  size="small"
                  onDelete={() => handleDelete(id)}
                  deleteIcon={
                    <CloseIcon
                      sx={{ fontSize: 16 }}
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(id);
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary-txt)",
                    "& .MuiChip-deleteIcon": {
                      color: "var(--color-primary-txt)",
                      "&:hover": {
                        color: "var(--color-neutral)",
                      },
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      >
        {options.map(option => (
          <MenuItem
            key={option._id}
            value={option._id}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "var(--color-primary-green)/20",
              },
            }}
          >
            <Checkbox checked={value.includes(option._id)} />
            <ListItemText primary={option.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;
