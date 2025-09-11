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
  Clock,
  BadgeMinus 
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import toast from "react-hot-toast";
import { deleteProfile, getUserProfileDetails } from "../../../Service/Operations/ProfileAPI";
import { MdDangerous } from "react-icons/md";
import ConfirmationModal from "../../Resusable/ConfirmationModal";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // Get token from Redux or localStorage as fallback
  const tokenFromStorage = token || localStorage.getItem("token");

  useEffect(() => {
    if (tokenFromStorage) {
      dispatch(getUserProfileDetails(tokenFromStorage));
    }
  }, [dispatch, tokenFromStorage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleDelete = async () => {
    if (!tokenFromStorage) {
      toast.error("Authentication required");
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteProfile());
      toast.success("Account deleted successfully");
      setShowModal(false);
      // Optionally redirect to home or login page
      navigate('/');
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAuthProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google':
        return <FcGoogle className="w-4 h-4" />;
      case 'facebook':
        return <FaFacebook className="w-4 h-4 text-blue-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAuthProviderLabel = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google':
        return 'Google Account';
      case 'facebook':
        return 'Facebook Account';
      default:
        return 'Email Account';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // No user data state
  if (!user && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button
            content="Go to Home"
            variant="primary"
            size="md"
            click={() => navigate('/')}
          />
        </div>
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
         {/* Delete Account Confirmation Modal - CORRECT IMPLEMENTATION */}
     {/* Delete Account Confirmation Modal */}
{showModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 -mt-100 min-h-screen">
  <ConfirmationModal
    title="Are you sure you want to Delete Account?"
    subtitle="This action cannot be undone. Your account and all associated data will be permanently deleted."
    btnContent1="Cancel"
    btnContent2={isDeleting ? "Deleting..." : "Delete"}
    onCancel={() => !isDeleting && setShowModal(false)}
    onConfirm={handleDelete}
    type="danger"
    isLoading={isDeleting}
    disabled={isDeleting}
  />
  </div>
)}

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
                    alt={`${user?.userName}'s profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center" style={{
                  display: (user?.imageUrl || user?.profilePicture) ? 'none' : 'flex'
                }}>
                  <User className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
                </div>
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
                  {user?.userName || 'Unknown User'}
                </h2>
                {user?.role && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                {getAuthProviderIcon(user?.authProvider)}
                <span className="text-sm font-medium">
                  {getAuthProviderLabel(user?.authProvider)}
                </span>
              </div>

              {user?.email && (
                <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              )}

              {user?.bio && (
                <p className="text-gray-700 mb-4 max-w-md">
                  {user?.bio}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
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
                <Button
                  content="Delete Account"
                  icon={BadgeMinus}
                  iconPosition="left"
                  variant="outline"
                  size="md"
                  click={() => setShowModal(true)}
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
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.contactNumber || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
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
                  {formatDate(user?.lastLoginAt)}
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