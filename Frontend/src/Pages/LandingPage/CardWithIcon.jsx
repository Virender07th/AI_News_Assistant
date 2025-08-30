import React from "react";

const isPreColoredIcon = (Icon) => {
  const name = Icon?.name || "";
  return name.startsWith("Fc");
};

const CardWithIcon = ({ icon: Icon, color = "", title, description }) => {
  const isPreColored = isPreColoredIcon(Icon);

  return (
    <div className="w-full max-w-[250px] min-h-[250px] p-6 rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-start items-center gap-4 text-center">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg ${
          isPreColored ? "bg-gray-100" : `bg-opacity-10 ${color} bg-gray-50`
        }`}
      >
        <Icon className={`w-6 h-6 ${isPreColored ? "" : color.replace("bg", "text")}`} />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default CardWithIcon;