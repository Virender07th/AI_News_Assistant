// Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../Resusable/Button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera,
  Shield,
  Globe,
  Heart,
  Clock
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import toast from "react-hot-toast";
import { getUserProfileDetaile } from "../../../Service/Operations/ProfileAPI";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const location = useLocation();
  const { user , loading } = useSelector((state) => state.profile);
  const [profileData, setProfileData] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const tokenFromStorage = token || localStorage.getItem("token")
  useEffect(() => {
    if(tokenFromStorage) {
      dispatch(getUserProfileDetaile(tokenFromStorage));
    }
}, [dispatch , tokenFromStorage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthProviderIcon = (provider) => {
    switch (provider) {
      case 'google':
        return <FcGoogle className="w-4 h-4" />;
      case 'facebook':
        return <FaFacebook className="w-4 h-4 text-blue-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAuthProviderLabel = (provider) => {
    switch (provider) {
      case 'google':
        return 'Google Account';
      case 'facebook':
        return 'Facebook Account';
      default:
        return 'Email Account';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                My Profile
              </h1>
              <p className="text-blue-600 font-medium">
                View and manage your personal details
              </p>
              {location.pathname.includes("edit") && (
                <p className="text-sm text-amber-600 font-semibold mt-1 flex items-center gap-1">
                  <Edit3 className="w-4 h-4" />
                  Editing Profile...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                {user?.imageUrl || user?.profilePicture ? (
                  <img
                    src={user?.imageUrl || user?.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Verification Badge */}
              {user?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <Shield className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {user?.userName}
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                {getAuthProviderIcon(user?.authProvider)}
                <span className="text-sm font-medium">
                  {getAuthProviderLabel(user?.authProvider)}
                </span>
              </div>

              <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>

              {user?.bio && (
                <p className="text-gray-700 mb-4 max-w-md">
                  {user?.bio}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  content="Edit Profile"
                  icon={Edit3}
                  iconPosition="left"
                  variant="primary"
                  size="md"
                  click={() => navigate("/edit-profile")}
                />
                <Button
                  content="Change Password"
                  icon={Shield}
                  iconPosition="left"
                  variant="outline"
                  size="md"
                  click={() => navigate("/update-password")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">{user?.userName || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">
                    Gender
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.gender || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1  flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.contactNumber || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1  flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.location || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Account Information
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1  flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-gray-900 font-medium">
                  {formatDate(user?.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last Login
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Account Status
                </label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user?.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          {user?.interests?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Interests
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {user?.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;