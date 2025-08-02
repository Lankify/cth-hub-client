import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const iconBoxClass = "bg-[var(--color-primary)] p-1 rounded-md hover:opacity-80 transition";

export default function ActionButtons({ onView, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Tooltip title="View">
          <div className={iconBoxClass}>
            <IconButton size="small" onClick={onView}>
              <VisibilityIcon htmlColor="var(--color-primary-blue)" fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="Edit">
          <div className={iconBoxClass}>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon htmlColor="var(--color-primary-green)" fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}
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
