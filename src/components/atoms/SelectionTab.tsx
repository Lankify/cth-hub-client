import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface SelectionTabProps {
  categories: string[];
  selectedCategory: string;
  onChange: (newCategory: string) => void;
}

const SelectionTab: React.FC<SelectionTabProps> = ({ categories, selectedCategory, onChange }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Box>
      <Tabs
        value={selectedCategory}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="inventory category tabs"
        sx={{
          ".MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            color: "var(--color-neutral-txt)",
          },
          ".Mui-selected": {
            color: "var(--color-neutral) !important",
          },
          ".MuiTabs-indicator": {
            backgroundColor: "var(--color-neutral)",
          },
        }}
      >
        {categories.map(category => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>
    </Box>
  );
};

export default SelectionTab;
