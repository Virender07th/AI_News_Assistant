import React, { useState, useEffect } from "react";
import Button from "./Button";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import { User, Building, TimerIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { saveNewsAPI, removeSaveNewsAPI, getSavedNewsAPI } from "../../Service/Operations/ProfileAPI";

const NewsCard = ({
  heading,
  description,
  image,
  category,
  author,
  publisher,
  date,
  url,
  newsId, // <-- backend-generated newsId
  btns = false,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(30);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // On mount, check if news is already saved
  useEffect(() => {
    const checkSavedNews = async () => {
      try {
        const res = await getSavedNewsAPI();
        if (res.success && res.data.some((n) => n.newsId.newsId === newsId)) {
          setBookmarked(true);
        }
      } catch (err) {
        console.error("Error checking saved news:", err);
      }
    };
    checkSavedNews();
  }, [newsId]);

  // Bookmark save/remove handler
  const handleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save news");
      return;
    }

    try {
      if (!bookmarked) {
        const payload = {
          title: heading,
          description,
          author,
          publisher,
          publishedAt: date,
          url,
          urlToImage: image,
          category,
        };
        const res = await saveNewsAPI(payload);
        if (res.success) {
          setBookmarked(true);
          setBookmarkCount((prev) => prev + 1);
          toast.success("News saved successfully");
        }
      } else {
        if (!newsId) {
          toast.error("Cannot remove news: missing newsId");
          return;
        }
        const res = await removeSaveNewsAPI(newsId);
        if (res.success) {
          setBookmarked(false);
          setBookmarkCount((prev) => prev - 1);
          toast.success("Saved news removed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update saved news");
    }
  };

  // Share handler
  const handleShare = () => {
    const shareData = { title: heading, text: description, url: window.location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(() => toast.error("Share canceled or failed."));
    } else {
      navigator.clipboard.writeText(`${heading} - ${window.location.href}`);
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

  return (
    <article className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="lg:w-1/2 w-full relative overflow-hidden rounded-2xl">
            <img
              src={image}
              alt={`News: ${heading}`}
              className="w-full h-48 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {category && (
              <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getCategoryColor(category)}`}>
                {category}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 w-full flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                {heading}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {author && <div className="flex items-center gap-1"><User size={16} /><span>{author}</span></div>}
                {publisher && <div className="flex items-center gap-1"><Building size={16} /><span>{publisher}</span></div>}
                {date && <div className="flex items-center gap-1"><TimerIcon size={16} /><span>{date}</span></div>}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {description ? (expanded ? description : description.slice(0, 150) + "...") : "No description available."}
              </p>
              {description && description.length > 150 && (
                <button onClick={() => setExpanded(!expanded)} className="text-blue-600 text-sm font-medium hover:underline">
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <Button
                content="Read Full Article"
                click={() =>
                  navigate("/news", { state: { heading, description, image, category, author, publisher, date, url, newsId } })
                }
              />

              {btns && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <button onClick={handleBookmark} className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-all duration-200 active:scale-95">
                      {bookmarked ? <MdBookmark size={20} className="text-yellow-600 animate-bounce" /> : <MdBookmarkBorder size={20} />}
                      <span className="text-sm font-medium">{bookmarkCount}</span>
                    </button>

                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 active:scale-95">
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
