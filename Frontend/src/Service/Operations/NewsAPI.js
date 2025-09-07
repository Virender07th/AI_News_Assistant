import { apiConnector } from "../apiConnector";
import { setLoading } from "../../Slice/profileSlice";
import { newsEndpoints } from "../apis";
import toast from "react-hot-toast";
import { setNewses, setNews, setAllNews, setLatestNews } from "../../Slice/newsSlice";

const {
  GET_TOP_HEADLINES_NEWS_API,
  GET_EVERYTHING_NEWS_API,
  GET_GOOGLE_NEWS_API,
} = newsEndpoints;

// 🔹 Top Headlines
export const getTopHeadlines =
  (token, filters = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading news...");
    try {
      const response = await apiConnector(
        "GET",
        GET_TOP_HEADLINES_NEWS_API,
        null, // no body
        { Authorization: `Bearer ${token}` }, // headers
        filters // query params
      );

      if (!response.data.success) throw new Error(response.data.message);

      dispatch(setNewses(response.data.articles || []));
      dispatch(setLatestNews(response.data.articles.length));
    } catch (err) {
      console.error("getTopHeadlines error:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch Top Headlines"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

// 🔹 Normalize API response to common format
const normalizeNews = (articles, sourceType) => {
  return articles.map((item) => {
    if (sourceType === "google") {
      return {
        heading: item.title,
        description: item.description,
        image: item.image || null,
        author: item.sourceName || "Unknown",
        publisher: item.sourceName || "Unknown",
        category: null,
        url: item.link,
        publishedAt: item.pubDate,
      };
    } else {
      // Everything News / NewsAPI
      return {
        heading: item.title,
        description: item.description,
        image: item.urlToImage || null,
        author: item.author || "Unknown",
        publisher: item.source?.name || "Unknown",
        category: null,
        url: item.url,
        publishedAt: item.publishedAt,
      };
    }
  });
};
export const getEverythings =
  (token, filters = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading news...");
    try {
      const response = await apiConnector(
        "GET",
        GET_EVERYTHING_NEWS_API,
        null,
        { Authorization: `Bearer ${token}` },
        filters
      );

      if (!response.data.success) throw new Error(response.data.message);

      const normalized = normalizeNews(
        response.data.articles || [],
        "everything"
      );
      dispatch(setNewses(normalized));
      dispatch(setAllNews(response.data.articles.length))
      console.log(normalized);
      
    } catch (err) {
      console.error("getEverythings error:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch Everything News"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

export const getGoogleNews =
  (token, filters = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading news...");

    try {
      // Prepare query parameters
      const { qSearch = "General News", categories = "General", hl = "en-IN", gl = "IN", ceid = "IN:en" } = filters;

      if (!qSearch && !categories) {
        toast.error("Please enter a search term or select a category");
        dispatch(setLoading(false));
        toast.dismiss(toastId);
        return;
      }

      // Format categories as comma-separated string
      const catParam = categories
        ? categories.split(",").map((c) => c.trim()).join(",")
        : "";

      // Build final query params for backend
      const queryParams = new URLSearchParams({
        qSearch: qSearch.trim(),
        categories: catParam,
        hl,
        gl,
        ceid,
      }).toString();

      const response = await apiConnector(
        "GET",
        `${GET_GOOGLE_NEWS_API}?${queryParams}`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) throw new Error(response.data.message);

      // Normalize articles for frontend
      const normalized = normalizeNews(response.data.articles || [], "google");
      dispatch(setNewses(normalized));
      dispatch(setAllNews(response.data.articles.length))
    } catch (err) {
      console.error("getGoogleNews error:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch Google News"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
