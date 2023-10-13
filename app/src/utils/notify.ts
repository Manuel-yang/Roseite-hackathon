import { TypeOptions, toast, Slide, Id } from "react-toastify";
import { ThemeMode } from "../contexts/ThemeContext";

export const notify = (
  message: string,
  type: TypeOptions,
  theme: ThemeMode = "light"
) => {
  toast(message, {
    position: "bottom-right",
    theme: theme,
    autoClose: 5000,
    transition: Slide,
    hideProgressBar: false,
    pauseOnFocusLoss: false,
    type: type,
    className: "toast-message",
  });
};

export const notifyLoading = (message: string, theme: ThemeMode = "light") => {
  return toast.loading(message, {
    position: "bottom-right",
    theme: theme,
    transition: Slide,
    className: "toast-message",
  });
};

export const notifyUpdate = (
  toastId: Id,
  message: string,
  type: TypeOptions
) => {
  toast.update(toastId, {
    render: message,
    type: type,
    autoClose: 5000,
    isLoading: false,
  });
};
