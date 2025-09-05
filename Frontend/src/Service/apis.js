// BASE URL (use HTTPS in production, HTTP for local dev)
const BASE_URL = "http://localhost:8000/api/v1";


// ========== AUTH ENDPOINTS ==========
export const authEndpoints = {
  SEND_OTP_API: BASE_URL + "/auth/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/auth/forgot-password",
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
  
};

// ========== PROFILE ENDPOINTS ==========
export const profileEndpoints = {
  GET_USER_PROFILE_API: BASE_URL + "/profile/getUserProfile",
  UPDATE_USER_PROFILE_API: BASE_URL + "/profile/updateUserProfile",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_USER_PROFILE_API: BASE_URL + "/profile/deleteUserProfile",
};
export const dashboardEndpoints = {
  GET_USER_ACTIVITY_API: BASE_URL + "/dashboard/activity",
  GET_USER_STATS_API: BASE_URL + "/dashboard/stats",
};

// ========== SEARCH ENDPOINTS ==========
// export const searchEndpoints = {
//   ADD_SEARCH_QUERY_API: BASE_URL + "/search/add-search",
//   GET_SEARCH_HISTORY_BY_USER_ID_API: BASE_URL + "/search/all-search",
//   CLEAR_SEARCH_HISTORY_API: BASE_URL + "/search/clear-search",
// };

// ========== SAVED NEWS ENDPOINTS ==========
export const savedEndpoints = {
  SAVE_NEWS_API: BASE_URL + "/saved/save",
  REMOVE_SAVED_NEWS_API: BASE_URL + "/saved/remove/:newsId",
  GET_ALL_SAVED_NEWS_API: BASE_URL + "/saved/allSave",
};

// ========== NEWS ENDPOINTS ==========
export const newsEndpoints = {
  GET_TOP_HEADLINES_NEWS_API: BASE_URL + "/news/top-headlines",
  GET_EVERYTHING_NEWS_API: BASE_URL + "/news/everything",
  GET_GOOGLE_NEWS_API:BASE_URL +"/news/google-news"
};

// ========== LIKES ENDPOINTS ==========
export const likesEndpoints = {
  LIKE_NEWS_API: BASE_URL + "/likes/like",
  UNLIKE_NEWS_API: BASE_URL + "/likes/unlike/:newsId",
  IS_NEWS_LIKED_API: BASE_URL + "/likes/:newsId",
  GET_LIKED_NEWS_BY_USER_ID_API: BASE_URL + "/likes/likedbyUser",
};

// ========== COMMENTS ENDPOINTS ==========
export const commentsEndpoints = {
  ADD_COMMENT_NEWS_API: BASE_URL + "/comments/:newsId",
  REPLY_TO_COMMENT_NEWS_API: BASE_URL + "/comments/reply/:parentCommentId",
  UPDATE_COMMENT_API: BASE_URL + "/comments/:commentId",
  DELETE_COMMENT_API: BASE_URL + "/comments/:commentId",
  GET_ALL_COMMENTS_BY_USER_API: BASE_URL + "/comments/user",
  GET_COMMENTS_BY_NEWS_ID_API: BASE_URL + "/comments/:newsId",
};

// ========== AI ENDPOINTS ==========
export const AiEndpoints = {
  FETCH_NEWS_ARTICLES_API: BASE_URL + "/ai/fetch-news",
  FACT_CHECK_NEWS_API: BASE_URL + "/ai/fact-check",
  BIAS_DETECTION_API: BASE_URL + "/ai/bias-detection",
  PARAGRAPH_SUMMARIZER_API: BASE_URL + "/ai/summarizer/para",
  BULLETS_SUMMARIZER_API: BASE_URL + "/ai/summarizer/bullets",
  HIGHLIGHT_SUMMARIZER_API: BASE_URL + "/ai/summarizer/highlight",
  TRANSLATE_API: BASE_URL + "/ai/translate",
  GENERATE_NEWS_ARTICLE_API: BASE_URL + "/ai/generate-news",
};
