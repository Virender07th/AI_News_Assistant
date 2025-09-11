import { apiConnector } from "../apiConnector";
import { setUser, setLoading } from "../../Slice/profileSlice";
import { profileEndpoints, dashboardEndpoints, savedEndpoints } from "../apis";
import { logout } from "./AuthAPI";
import toast from "react-hot-toast";
import { setUserActivity, setUserStats } from "../../Slice/dashboardSlice";

const {
  GET_USER_PROFILE_API,
  UPDATE_USER_PROFILE_API,
  UPDATE_DISPLAY_PICTURE_API,
  CHANGE_PASSWORD_API,
  DELETE_USER_PROFILE_API,
} = profileEndpoints;

const { GET_USER_ACTIVITY_API, GET_USER_STATS_API } = dashboardEndpoints;

const { SAVE_NEWS_API, REMOVE_SAVED_NEWS_API, GET_ALL_SAVED_NEWS_API } = savedEndpoints;

// Fetch user activity
export const fetchUserActivity = (token) => async (dispatch) => {
  const toastId = toast.loading("Loading activities...");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("GET", GET_USER_ACTIVITY_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    dispatch(setUserActivity(response.data.activities));
    console.log("Activities:", response.data.activities);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    toast.error(
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch activities"
    );
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

// Fetch user stats
export const fetchUserStats = (token) => async (dispatch) => {
  const toastId = toast.loading("Loading stats...");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("GET", GET_USER_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    dispatch(setUserStats(response.data.stats));
    console.log("Stats:", response.data.stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    toast.error(
      error?.response?.data?.message || 
      error.message || 
      "Failed to fetch stats"
    );
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

// Fetch user profile details
export const getUserProfileDetails = (token) => async (dispatch) => {
  const toastId = toast.loading("Loading profile...");
  dispatch(setLoading(true));

  try {
    const response = await apiConnector("GET", GET_USER_PROFILE_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const apiUser = response.data.data;

    const mappedUser = {
      ...apiUser,
      imageUrl: apiUser.additionalDetails?.imageUrl || "",
      contactNumber: apiUser.additionalDetails?.contactNumber || "",
      bio: apiUser.additionalDetails?.bio || "",
      location: apiUser.additionalDetails?.location || "",
      gender: apiUser.additionalDetails?.gender || "",
      interests: apiUser.additionalDetails?.interests || [],
    };

    dispatch(setUser(mappedUser));
    console.log("User profile:", mappedUser);
    localStorage.setItem("user", JSON.stringify(mappedUser));
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error(
      error?.response?.data?.message || 
      "Failed to fetch user profile"
    );
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
};

// Update display picture
export const updateDisplayPicture = (token, file) => async (dispatch) => {
  const toastId = toast.loading("Uploading image...");

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiConnector(
      "PUT",
      UPDATE_DISPLAY_PICTURE_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    );

    console.log("Update display picture response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const updatedUser = response.data.data;
    const userObj = { ...updatedUser, image: updatedUser.imageUrl };

    dispatch(setUser(userObj));
    localStorage.setItem("user", JSON.stringify(userObj));
    toast.success("Display picture updated successfully");
  } catch (error) {
    console.error("Error updating display picture:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not update display picture"
    );
  } finally {
    toast.dismiss(toastId);
  }
};

// Update profile information
export const updateProfile = (token, formData) => async (dispatch) => {
  const toastId = toast.loading("Saving changes...");

  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_PROFILE_API,
      formData,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    const updatedUser = response.data.data;
    const userImage =
      updatedUser.image ||
      updatedUser.imageUrl ||
      `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.userName}`;

    dispatch(setUser({ ...updatedUser, image: userImage }));
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not update profile"
    );
  } finally {
    toast.dismiss(toastId);
  }
};

// Change password
export const changePassword = (token, formData) => async (dispatch) => {
  const toastId = toast.loading("Changing password...");

  try {
    const response = await apiConnector(
      "POST",
      CHANGE_PASSWORD_API,
      formData,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not change password"
    );
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete user profile
export const deleteProfile = (token, navigate) => async (dispatch) => {
  const toastId = toast.loading("Deleting profile...");

  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_USER_PROFILE_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Profile deleted successfully");
    dispatch(logout(navigate));
    navigate("/");
  } catch (error) {
    console.error("Error deleting profile:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not delete profile"
    );
  } finally {
    toast.dismiss(toastId);
  }
};

// Save news article
export const saveNewsAPI = (token, payload) => async (dispatch) => {
  const toastId = toast.loading("Saving news...");

  try {
    const response = await apiConnector(
      "POST", 
      SAVE_NEWS_API, 
      payload, 
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Save news response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("News saved successfully");
    return response.data;
  } catch (error) {
    console.error("Error saving news:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not save news"
    );
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Remove saved news article
export const removeSavedNewsAPI = (token, newsId) => async (dispatch) => {
  const toastId = toast.loading("Removing saved news...");

  try {
    const response = await apiConnector(
      "DELETE",
      REMOVE_SAVED_NEWS_API.replace(":newsId", newsId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Remove saved news response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("News removed successfully");
    return response.data;
  } catch (error) {
    console.error("Error removing saved news:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not remove saved news"
    );
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Get all saved news articles
export const getSavedNewsAPI = (token) => async (dispatch) => {
  const toastId = toast.loading("Loading saved news...");

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_SAVED_NEWS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Saved news API response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching saved news:", error);
    toast.error(
      error?.response?.data?.message || 
      "Could not fetch saved news"
    );
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};