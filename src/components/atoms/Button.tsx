import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  [key: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  startIcon,
  endIcon,
  ...props
}) => {
  const bgColor = variant === "primary" ? "#2b5cfd" : "#1d2438";
  const hoverColor = variant === "primary" ? "#1f49d1" : "#161c2b";

  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "2px",
        boxShadow: 2,
        textTransform: "none",
        "&:hover": {
          backgroundColor: hoverColor,
          transform: "scale(1.02)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
