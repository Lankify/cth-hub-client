import { Snackbar, Alert } from "@mui/material";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ open: boolean; message: string; type: ToastType }>({
    open: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ open: true, message, type });
  };

  const handleClose = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={toast.type} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
