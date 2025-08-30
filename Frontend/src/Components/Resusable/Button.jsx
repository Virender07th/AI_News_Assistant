import React from "react";

const Button = ({
  type = "button",
  btnColor = "",
  content = "Submit",
  data = true,
  condition = true,
  color = true,
  click,
  loading = false,
  style = "",
  icon: Icon,
}) => {
  const isDisabled = !data || !condition;

  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base rounded-[24px] font-medium transition duration-300 text-center whitespace-nowrap  sm:w-auto";

  const disabledStyle = "opacity-50 cursor-not-allowed";
  const enabledHover = "hover:bg-[#166FCC]";

  const colorStyle = btnColor
    ? btnColor
    : color
    ? "text-white bg-[#1A7DE5]"
    : "text-[#1e2125] bg-gray-300 hover:text-black hover:bg-gray-200";

  const iconColor = color || btnColor ? "text-white" : "text-black";

  return (
    <button
      type={type}
      disabled={isDisabled || loading}
      onClick={click}
      className={`${baseStyle} ${colorStyle} ${
        isDisabled ? disabledStyle : enabledHover
      } ${style}`}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        <>
          {Icon && <Icon size={18} className={iconColor} />}
          {content}
        </>
      )}
    </button>
  );
};

export default Button;
