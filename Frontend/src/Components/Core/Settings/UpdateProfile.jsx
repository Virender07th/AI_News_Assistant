import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputField from "../../Resusable/InputField";
import Button from "../../Resusable/Button";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";
import {
  getUserProfileDetails,
  updateDisplayPicture,
  updateProfile,
} from "../../../Service/Operations/ProfileAPI";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    contactNumber: "",
    location: "",
    bio: "",
    gender: "",
    interests: [],
  });

  const [profileImage, setProfileImage] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Destructure for convenience
  const { userName, contactNumber, location, bio, gender , interests} = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        contactNumber: user.additionalDetails?.contactNumber || "",
        location: user.additionalDetails?.location || "",
        bio: user.additionalDetails?.bio || "",
        gender: user.additionalDetails?.gender || "",
        interests: user.additionalDetails?.interests || [],
      });

      if (user.profilePicture || user.additionalDetails?.imageUrl) {
        setImagePreview(user.profilePicture || user.additionalDetails?.imageUrl);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    } else if (formData.interests.includes(newInterest.trim())) {
      toast.error("Interest already added");
    }
  };

  const removeInterest = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileImage) {
        await dispatch(updateDisplayPicture(token, profileImage));
      }

      if (
        formData.bio ||
        formData.gender ||
        formData.location ||
        formData.contactNumber || 
        formData.interests
      ) {
        await dispatch(updateProfile(token, formData));
        await dispatch(getUserProfileDetails(token));
      }

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              click={() => navigate("/profile")}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edit Profile
              </h1>
              <p className="text-purple-600 font-medium">
                Update your profile details and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 mx-auto">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-2 right-2 bg-purple-600 text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-purple-700 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Click camera icon to change profile picture (Max 5MB)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Basic Information
                </h3>

                <InputField
                  label="Full Name"
                  name="userName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.userName}
                  onChange={handleInputChange}
                  icon={User}
                  iconPosition="left"
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-xl px-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other Gender">Other Gender</option>
                  </select>
                </div>

                <InputField
                  label="Phone Number"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  icon={Phone}
                  iconPosition="left"
                  helperText="Format: 10 digits only"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Contact & Location
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-xl pl-10 pr-4 py-3 bg-gray-100 border-2 border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <InputField
                  label="Location"
                  name="location"
                  type="text"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={handleInputChange}
                  icon={MapPin}
                  iconPosition="left"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Bio
              </label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-xl px-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Interests Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Interests
              </label>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add an interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  className="flex-1 rounded-xl px-4 py-2 border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={Plus}
                  content="Add"
                  click={addInterest}
                  data={newInterest.trim()}
                  condition={newInterest.trim()}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                size="lg"
                content="Cancel"
                icon={ArrowLeft}
                iconPosition="left"
                click={() => navigate("/profile")}
                fullWidth
              />
              <Button
                type="submit"
                variant="success"
                size="lg"
                content="Save Changes"
                icon={Save}
                iconPosition="left"
                loading={loading}
                fullWidth
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile