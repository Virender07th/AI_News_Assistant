import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import profileImg from "../../../assets/bg3.jpg";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(profileImg);
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("+91 9876543210");
  const [address, setAddress] = useState("123, Main Street, Mumbai, India");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    navigate("/profile");
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <div className="sticky top-0 z-50 bg-white px-6 py-6 border-b border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold mb-1">Edit Profile</h1>
        <p className="text-[#4D5E99] font-semibold">Update your profile details and image.</p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* Profile Image Upload */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 sm:border-6 border-white shadow-xl overflow-hidden bg-white">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 
                  file:mr-4 file:py-1.5 file:px-4
                  file:rounded-full file:border-0
                  file:bg-blue-100 file:text-blue-700
                  hover:file:bg-blue-200 cursor-pointer"
              />
            </label>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email (disabled) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value="john@example.com"
                disabled
                className="w-full rounded-xl px-4 py-2 bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow-sm hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
