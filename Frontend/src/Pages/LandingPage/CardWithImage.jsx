import React from "react";

const CardwithImage = ({ image, title, description }) => {
  return (
    <div className="w-full max-w-[250px] min-h-[250px] p-4 rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center gap-4">
      <div className="w-full h-36 overflow-hidden rounded-xl">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default CardwithImage;