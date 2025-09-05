import React, { useState } from "react";
import Button from "./Button";
import { IoChatbubbleOutline, IoHeartOutline } from "react-icons/io5";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { PiShareFatLight } from "react-icons/pi";
import { User, Building } from "lucide-react";
import { TimerIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewsCard = ({
  heading,
  description,
  image,
  category,
  author,
  publisher,
  date,
  url,
  btns = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(120);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(30);
  const [commentsCount] = useState(20);
  const [expanded, setExpanded] = useState(false); // ✅ new state
  const navigate = useNavigate();

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    setBookmarkCount((prev) => prev + (bookmarked ? -1 : 1));
  };

  const handleShare = () => {
    const shareData = {
      title: heading,
      text: description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        toast.error("Share canceled or failed.");
      });
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
              <div
                className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getCategoryColor(
                  category
                )}`}
              >
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
                {author && (
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
                    <span>{date}</span>
                  </div>
                )}
              </div>

              {/* ✅ Read More Toggle */}
              <p className="text-gray-600 leading-relaxed">
                {description
                  ? expanded
                    ? description
                    : description.length > 150
                    ? description.slice(0, 150) + "..."
                    : description
                  : "No description available."}
              </p>

              {description && description.length > 150 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
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
                    },
                  })
                }
              />

              {btns && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-200 active:scale-95"
                    >
                      {liked ? (
                        <FcLike size={20} className="animate-pulse" />
                      ) : (
                        <IoHeartOutline size={20} />
                      )}
                      <span className="text-sm font-medium">{likesCount}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all duration-200 active:scale-95">
                      <IoChatbubbleOutline size={20} />
                      <span className="text-sm font-medium">
                        {commentsCount}
                      </span>
                    </button>
                    <button
                      onClick={handleBookmark}
                      className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-all duration-200 active:scale-95"
                    >
                      {bookmarked ? (
                        <MdBookmark
                          size={20}
                          className="text-yellow-600 animate-bounce"
                        />
                      ) : (
                        <MdBookmarkBorder size={20} />
                      )}
                      <span className="text-sm font-medium">
                        {bookmarkCount}
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 active:scale-95"
                  >
                    <PiShareFatLight size={20} />
                    <span className="text-sm font-medium hidden sm:inline">
                      Share
                    </span>
                  </button>
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
