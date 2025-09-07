import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import Button from "../../Resusable/Button";
import toast from "react-hot-toast";
import {
  getSavedNewsAPI,
  removeSaveNewsAPI,
} from "../../../Service/Operations/ProfileAPI";

const SavedNews = ({ user }) => {
  const [savedNews, setSavedNews] = useState([]);
  const [isLoadingSavedNews, setIsLoadingSavedNews] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const tokenFromStorage = token || localStorage.getItem("token");

  useEffect(() => {
    if (tokenFromStorage) fetchSavedNews();
  }, [tokenFromStorage]);

  const fetchSavedNews = async () => {
    if (!tokenFromStorage) return;
    setIsLoadingSavedNews(true);
    try {
      const response = await getSavedNewsAPI();
      let newsData = [];
      if (response?.data) newsData = response.data;
      else if (Array.isArray(response)) newsData = response;
      setSavedNews(newsData);
    } catch (error) {
      console.error("Error fetching saved news:", error);
      toast.error("Failed to load saved news");
      setSavedNews([]);
    } finally {
      setIsLoadingSavedNews(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Helper to get correct ID for deletion
  const getNewsId = (savedItem) => savedItem.newsId?.newsId || null;

  const handleRemoveNews = async (savedItem) => {
    const newsId = getNewsId(savedItem);
    console.log("newid", newsId);

    if (!tokenFromStorage || !newsId) return;

    try {
      await removeSaveNewsAPI(newsId);
      toast.success("News removed successfully");

      // Remove from local state
      setSavedNews((prev) => prev.filter((item) => getNewsId(item) !== newsId));
    } catch (error) {
      console.error("Error removing news:", error);
      toast.error("Failed to remove news");
    }
  };

  const displayedNews = showAllNews ? savedNews : savedNews.slice(0, 3);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 ${
        user?.interests?.length ? "" : "lg:col-span-2"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-indigo-600" />
          Saved News
          {savedNews.length > 0 && (
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full">
              {savedNews.length}
            </span>
          )}
        </h3>
        {savedNews.length > 0 && (
          <Button
            content="Refresh"
            variant="outline"
            size="sm"
            click={fetchSavedNews}
            disabled={isLoadingSavedNews}
          />
        )}
      </div>

      {isLoadingSavedNews ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading saved news...</span>
        </div>
      ) : savedNews.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No saved news articles yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Start saving articles to see them here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedNews.map((savedItem, index) => {
              const article = savedItem.newsId || savedItem;
              if (!article || (!article.title && !article.url)) return null;

              const newsId = getNewsId(savedItem);

              return (
                <div
                  key={newsId || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title || "News article"}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title || "Untitled Article"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {truncateText(article.description)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                          <span>
                            {article.publisher ||
                              article.source ||
                              "Unknown Source"}
                          </span>
                          {article.publishedAt && (
                            <>
                              <span>•</span>
                              <span>{formatDate(article.publishedAt)}</span>
                            </>
                          )}
                          {article.author &&
                            article.author !== "Unknown" &&
                            article.author.trim() && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-32">
                                  {article.author}
                                </span>
                              </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              Read More
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          <button
                            onClick={() => handleRemoveNews(savedItem)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                        {savedItem.createdAt && (
                          <span>
                            Saved on {formatDate(savedItem.createdAt)}
                          </span>
                        )}
                        {article.category && article.category !== "General" && (
                          <>
                            <span>•</span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {article.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {savedNews.length > 3 && (
            <div className="text-center mt-6">
              <Button
                content={
                  showAllNews
                    ? "Show Less"
                    : `Show All (${savedNews.length - 3} more)`
                }
                variant="outline"
                size="sm"
                click={() => setShowAllNews(!showAllNews)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedNews;
