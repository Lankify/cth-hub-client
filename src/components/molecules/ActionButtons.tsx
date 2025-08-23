import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

type CustomButtonProps = {
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
};

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customButton?: CustomButtonProps;
};

const iconBoxClass = "bg-primary p-1 rounded-md hover:opacity-80 transition";

export default function ActionButtons({ onView, onEdit, onDelete, customButton }: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* Custom Button (Optional) */}
      {customButton && (
        <Tooltip title={customButton.tooltip}>
          <div className={customButton.className || iconBoxClass}>
            <IconButton size="small" onClick={customButton.onClick}>
              {customButton.icon}
            </IconButton>
          </div>
        </Tooltip>
      )}

      {/* View */}
      {onView && (
        <Tooltip title="View">
          <div className={iconBoxClass}>
            <IconButton size="small" onClick={onView}>
              <VisibilityIcon htmlColor="var(--color-primary-blue)" fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}

      {/* Edit */}
      {onEdit && (
        <Tooltip title="Edit">
          <div className={iconBoxClass}>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon htmlColor="var(--color-primary-green)" fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}

      {/* Delete */}
      {onDelete && (
        <Tooltip title="Delete">
          <div className={iconBoxClass}>
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon htmlColor="var(--color-primary-red)" fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}
    </div>
  );
}
