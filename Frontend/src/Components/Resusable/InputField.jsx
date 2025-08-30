import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  style = "",
  icon: Icon = null,
  iconPosition = "left",
  fieldStyle="",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col  w-full gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className={`relative ${style}`}>
        {/* Left Icon */}
        {Icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Icon size={18} />
          </div>
        )}

        {/* Input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full  px-3 py-2 text-sm border-1 focus:border-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400 ${
            Icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""
          }  ${fieldStyle}`}
          {...props}
        />

        {/* Right Icon */}
        {Icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <Icon size={18} />
          </div>
        )}

        {/* Password Toggle */}
        {isPassword && value && (
          <div
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
