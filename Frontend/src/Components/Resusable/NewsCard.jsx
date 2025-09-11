import React, { useState, useEffect } from "react";
import Button from "./Button";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import { User, Building, TimerIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { saveNewsAPI, removeSavedNewsAPI, getSavedNewsAPI } from "../../Service/Operations/ProfileAPI";
import { useDispatch, useSelector } from "react-redux";

const NewsCard = ({
  heading,
  description,
  image,
  category,
  author,
  publisher,
  date,
  url,
  newsId, // backend-generated newsId
  btns = false,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(30);
  const [expanded, setExpanded] = useState(false);
  const [isCheckingBookmark, setIsCheckingBookmark] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // On mount, check if news is already saved
  useEffect(() => {
    const checkSavedNews = async () => {
      if (!token || !newsId) return;
      
      setIsCheckingBookmark(true);
      try {
        const response = await dispatch(getSavedNewsAPI(token));
        
        // Handle different response formats
        let savedNewsData = [];
        if (response?.data) {
          savedNewsData = response.data;
        } else if (Array.isArray(response)) {
          savedNewsData = response;
        }
        
        // Check if current news is saved
        const isAlreadySaved = savedNewsData.some((savedItem) => {
          const savedNewsId = savedItem.newsId?.newsId || savedItem._id || savedItem.id;
          return savedNewsId === newsId;
        });
        
        setBookmarked(isAlreadySaved);
      } catch (err) {
        console.error("Error checking saved news:", err);
      } finally {
        setIsCheckingBookmark(false);
      }
    };

    checkSavedNews();
  }, [newsId, token, dispatch]);

  // Bookmark save/remove handler
  const handleBookmark = async () => {
    if (!token) {
      toast.error("Please login to save news");
      return;
    }

    try {
      if (!bookmarked) {
        // Save news
        const payload = {
          newsId, // Include the newsId in payload
          title: heading,
          description,
          author,
          publisher,
          publishedAt: date,
          url,
          urlToImage: image,
          category,
        };
        
        const response = await dispatch(saveNewsAPI(token, payload));
        
        if (response?.success !== false) {
          setBookmarked(true);
          setBookmarkCount((prev) => prev + 1);
          // Toast success is handled in the API function
        }
      } else {
        // Remove saved news
        if (!newsId) {
          toast.error("Cannot remove news: missing newsId");
          return;
        }
        
        const response = await dispatch(removeSavedNewsAPI(token, newsId));
        
        if (response?.success !== false) {
          setBookmarked(false);
          setBookmarkCount((prev) => prev - 1);
          // Toast success is handled in the API function
        }
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
      // Error toasts are handled in the API functions
    }
  };

  // Share handler
  const handleShare = () => {
    const shareData = { 
      title: heading, 
      text: description, 
      url: url || window.location.href // Use article URL if available
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(() => 
        toast.error("Share canceled or failed.")
      );
    } else {
      const textToShare = url 
        ? `${heading} - ${url}` 
        : `${heading} - ${window.location.href}`;
      
      navigator.clipboard.writeText(textToShare);
      toast.success("Link copied to clipboard!");
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      AI: "bg-blue-500 text-white",
      Space: "bg-purple-500 text-white",
      Cybersecurity: "bg-red-500 text-white",
      Healthcare: "bg-green-500 text-white",
      Finance: "bg-yellow-500 text-white",
      Technology: "bg-indigo-500 text-white",
      Politics: "bg-gray-500 text-white",
      Sports: "bg-orange-500 text-white",
    };
    return colors[cat] || "bg-gray-500 text-white";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? dateString 
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <article className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Image Section */}
          {image && (
            <div className="lg:w-1/2 w-full relative overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={`News: ${heading || 'Article'}`}
                className="w-full h-48 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {category && (
                <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getCategoryColor(category)}`}>
                  {category}
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className={`${image ? 'lg:w-1/2' : 'w-full'} flex flex-col justify-between space-y-4`}>
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                {heading || "Untitled Article"}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {author && author !== "Unknown" && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{author}</span>
                  </div>
                )}
                {publisher && (
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{publisher}</span>
                  </div>
                )}
                {date && (
                  <div className="flex items-center gap-1">
                    <TimerIcon size={16} />
                    <span>{formatDate(date)}</span>
                  </div>
                )}
              </div>

              {description && (
                <>
                  <p className="text-gray-600 leading-relaxed">
                    {expanded ? description : `${description.slice(0, 150)}${description.length > 150 ? '...' : ''}`}
                  </p>
                  {description.length > 150 && (
                    <button 
                      onClick={() => setExpanded(!expanded)} 
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="space-y-4">
              <Button
                content="Read Full Article"
                click={() =>
                  navigate("/news", { 
                    state: { 
                      heading, 
                      description, 
                      image, 
                      category, 
                      author, 
                      publisher, 
                      date, 
                      url, 
                      newsId 
                    } 
                  })
                }
              />

              {btns && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={handleBookmark} 
                      disabled={isCheckingBookmark || !token}
                      className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingBookmark ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      ) : bookmarked ? (
                        <MdBookmark size={20} className="text-yellow-600 animate-bounce" />
                      ) : (
                        <MdBookmarkBorder size={20} />
                      )}
                      <span className="text-sm font-medium">{bookmarkCount}</span>
                    </button>

                    <button 
                      onClick={handleShare} 
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      <PiShareFatLight size={20} />
                      <span className="text-sm font-medium hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;