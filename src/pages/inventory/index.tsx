import * as theme from "../../theme";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { useState } from "react";
import { Box, Stack } from "@mui/material";

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Desktop", "Laptop", "Mobile Phone", "Camera", "Other"];

  return (
    <div>
      <h2 className={theme.text["main-title"]}>Inventory Overview</h2>
      <p className={theme.text["sub-title"]}>12 items found</p>
      <div className="mb-4" style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <input type="text" className={theme.textField.searchInput} placeholder="Looking for..." />
        <Button startIcon={<FiPlusCircle />} onClick={() => navigate("/inventory/new-item")}>
          Add New Item
        </Button>
      </div>
      <Box mt={2}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "secondary"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export default Inventory;
