import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import profile from "../../../assets/bg1.jpg";
import Button from "../../Resusable/Button";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col w-full bg-white px-4 gap-4">
      {/* Header */}
      <div className="bg-white px-2 py-2 border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">My Profile</h1>
        <p className="text-[#4D5E99] text-sm md:text-md font-semibold">
          View and manage your personal details.
        </p>
        {location.pathname.endsWith("edit-profile") && (
          <p className="text-sm text-blue-500 font-semibold mt-1">Editing Profile...</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow w-full max-w-5xl mx-auto">
        <div className="mt-10 mb-10 flex flex-row items-center justify-between gap-6">
          {/* Image + Name */}
          <div className="flex flex-row items-center gap-4 sm:gap-6">
  {/* Profile Image */}
  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[6px] border-gray-100 bg-white overflow-hidden shadow-lg transform transition  ease-in-out active:-scale-50 hover:border-blue-200 object-cover   hover:scale-[1.01] hover:shadow-xl  duration-300">
  <img
  src={profile}
  alt="User profile"
  className="w-full h-full object-cover shadow-md transition-transform duration-300 ease-in-out transform hover:scale-95 hover:shadow-xl"
/>

</div>


  {/* Name and Email */}
  <div>
    <h2 className="text-xl sm:text-2xl font-extrabold text-blue-600">
      John Doe
    </h2>
    <p className="text-sm sm:text-base text-gray-500">john@example.com</p>
  </div>
</div>


          <Button
            content="Edit Profile"
            data={true}
            condition={true}
            style="rounded-full px-6 py-2 text-sm font-medium"
            click={() => navigate("/edit-profile")}
          />
        </div>

        {/* Info Grid */}
        <div className="bg-blue-50 border border-gray-100 rounded-xl shadow-sm p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mb-10">
          {[
            { label: "Full Name", value: "John Doe" },
            { label: "Email", value: "john@example.com" },
            { label: "Phone", value: "+91 9876543210" },
            { label: "Address", value: "123, Main Street, Mumbai, India" },
            { label: "Joined", value: "Jan 20, 2023" },
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">{item.label}</p>
              <p className="text-base text-gray-800 break-words">{item.value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
