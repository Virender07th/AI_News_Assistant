import Button from "./Button";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const ConfirmationModal = ({
  btnContent1 = "Cancel",
  btnContent2 = "Confirm",
  onCancel,
  onConfirm,
  title = "Are you sure?",
  subtitle = "This action cannot be undone.",
  type = "default", // default, danger, warning, success
  showIcon = true,
  isLoading = false,
  disabled = false,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-500",
          headerBg: "bg-red-50",
          iconBg: "bg-red-100",
          confirmBtnClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
        };
      case "warning":
        return {
          iconColor: "text-yellow-500",
          headerBg: "bg-yellow-50",
          iconBg: "bg-yellow-100",
          confirmBtnClass: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-400",
        };
      case "success":
        return {
          iconColor: "text-green-500",
          headerBg: "bg-green-50",
          iconBg: "bg-green-100",
          confirmBtnClass: "bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400",
        };
      default:
        return {
          iconColor: "text-blue-500",
          headerBg: "bg-blue-50",
          iconBg: "bg-blue-100",
          confirmBtnClass: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
        };
    }
  };

  const typeStyles = getTypeStyles();
  const isDisabled = disabled || isLoading;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDisabled) {
      onCancel();
    }
  };

  const handleCancel = () => {
    if (!isDisabled) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (!isDisabled) {
      onConfirm();
    }
  };
  
  return (
    <>
    
      <div className={`relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100 opacity-100 z-10 ${
        isDisabled ? 'pointer-events-none' : ''
      }`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Processing...</p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={isDisabled}
          className={`absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 z-30 ${
            isDisabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className={`px-6 pt-6 pb-4 ${typeStyles.headerBg} border-b border-gray-100`}>
          <div className="flex items-start space-x-4">
            {showIcon && (
              <div className={`flex-shrink-0 w-12 h-12 ${typeStyles.iconBg} rounded-full flex items-center justify-center`}>
                <AlertTriangle className={`w-6 h-6 ${typeStyles.iconColor}`} />
              </div>
            )}
            <div className="flex-1 pt-1">
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-6 py-6 bg-gray-50">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleCancel}
              disabled={isDisabled}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ${
                isDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {btnContent1}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isDisabled}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm text-white focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                typeStyles.confirmBtnClass
              } ${
                isDisabled ? 'cursor-not-allowed' : ''
              }`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {btnContent2}
            </button>
          </div>
        </div>

        {/* Progress indicator for loading */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse"></div>
          </div>
        )}
      </div>
            </>
  );
};

export default ConfirmationModal;