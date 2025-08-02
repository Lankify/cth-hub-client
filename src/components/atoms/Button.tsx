import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  bgColor?: string; // NEW
  hoverColor?: string; // NEW
  [key: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  startIcon,
  endIcon,
  bgColor,
  hoverColor,
  ...props
}) => {
  const defaultBgColor = variant === "primary" ? "#2b5cfd" : "#2b3549";
  const defaultHoverColor = variant === "primary" ? "#1f49d1" : "#262f41";

  const appliedBgColor = bgColor || defaultBgColor;
  const appliedHoverColor = hoverColor || defaultHoverColor;

  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        backgroundColor: appliedBgColor,
        color: "white",
        borderRadius: "2px",
        boxShadow: 2,
        textTransform: "none",
        "&:hover": {
          backgroundColor: appliedHoverColor,
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
