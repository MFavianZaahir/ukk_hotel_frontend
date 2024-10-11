import { ToastContext } from "./toast-context";
import { useContext } from "react";

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
