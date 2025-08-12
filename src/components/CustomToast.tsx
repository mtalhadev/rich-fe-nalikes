import React from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface CustomToastProps {
  title: string;
  message: string;
  onClose?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  title,
  message,
  onClose,
}) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-primary-blue";
      default:
        return "border-l-primary-blue";
    }
  };

  const getTitleColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "warning":
        return "text-yellow-700";
      case "info":
        return "text-primary-blue";
      default:
        return "text-primary-blue";
    }
  };

  return (
    <div
      className={`flex w-full items-center justify-between border-l-4 bg-accent-yellow px-4 py-3 shadow-blue-3 ${getBorderColor(
        title
      )}`}
    >
      <div className="flex items-center">
        <div className="mr-3 flex-shrink-0">{getIcon(title)}</div>

        {/* Title & Message */}
        <div className="pl-2 pr-2">
          <p
            className={`text-lg font-luckiest-guy font-normal leading-tight ${getTitleColor(
              title
            )}`}
          >
            {title?.toUpperCase()}
          </p>
          <p className="text-sm font-poppins font-medium leading-tight text-dark-blue mt-1">
            {message}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-2 flex-shrink-0 text-dark-blue hover:text-primary-blue transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

// Function to trigger toast
export const showToast = (
  type: "success" | "error" | "info" | "warning",
  message: string
) => {
  toast(
    ({ closeToast }) => (
      <CustomToast title={type} message={message} onClose={closeToast} />
    ),
    {
      autoClose: 5000,
      closeOnClick: true,
    } as ToastOptions
  );
};

// Toast container for all toasts (Responsive)
export const ToastWrapper = () => (
  <ToastContainer
    hideProgressBar
    closeOnClick={false}
    toastClassName="custom-toast"
    position="bottom-right"
    style={{
      bottom: "40px",
      right: "40px",
    }}
  />
);

export default CustomToast;
