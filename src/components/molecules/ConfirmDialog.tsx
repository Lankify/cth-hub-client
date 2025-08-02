import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: React.ReactNode;
  onClose?: () => void;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  actions?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "error" | "success" | "info" | "inherit";
    variant?: "contained" | "outlined" | "text";
    props?: React.ComponentProps<typeof Button>;
  }[];
  showDividers?: boolean;
  contentSx?: object;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  showCancelButton = true,
  cancelButtonText = "Cancel",
  cancelButtonProps = {},
  actions = [],
  showDividers = false,
  contentSx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-txt)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        },
      }}
    >
      {title && <DialogTitle sx={{ color: "var(--color-primary-txt)" }}>{title}</DialogTitle>}

      <DialogContent
        dividers={showDividers}
        sx={{
          color: "var(--color-primary-txt)",
          ...(showDividers && {
            "&.MuiDialogContent-dividers": {
              borderTop: "1px solid #718096",
              borderBottom: "1px solid #718096",
            },
          }),
          ...contentSx,
        }}
      >
        {content}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        {showCancelButton && onClose && (
          <Button onClick={onClose} size="small" color="inherit" {...cancelButtonProps}>
            {cancelButtonText}
          </Button>
        )}

        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            size="small"
            color={action.color || "primary"}
            variant={action.variant || "contained"}
            {...action.props}
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
