import Button from "./Button";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  btnContent1 = "Cancel",
  btnContent2 = "Confirm",
  onCancel,
  onConfirm,
  title = "Are you sure?",
  subtitle = "This action cannot be undone.",
  type = "default", // default, danger, warning, success
  showIcon = true,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-500",
          headerBg: "bg-red-50",
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          iconColor: "text-yellow-500",
          headerBg: "bg-yellow-50",
          iconBg: "bg-yellow-100",
        };
      case "success":
        return {
          iconColor: "text-green-500",
          headerBg: "bg-green-50",
          iconBg: "bg-green-100",
        };
      default:
        return {
          iconColor: "text-blue-500",
          headerBg: "bg-blue-50",
          iconBg: "bg-blue-100",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-6 py-6 bg-gray-50">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
            <Button
              content={btnContent1}
              click={onCancel}
              style="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              color={false}
            />
            <Button
              content={btnContent2}
              click={onConfirm}
              style={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                  : type === "warning"
                  ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white"
                  : type === "success"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"
              }`}
              color={true}
            />
          </div>
        </div>

        {/* Optional Progress Bar for Loading States */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;