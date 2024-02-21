import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
  });
};

export const showError = (message) => {
  showToast(message, "error");
};

export const showSuccess = (message) => {
  showToast(message, "success");
};


export const showInfo = (message) => {
  showToast(message, "info");
};


export const showWarning = (message) => {
  showToast(message, "warn");
};
