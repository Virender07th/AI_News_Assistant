import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHeartOutline, IoChatbubbleOutline } from "react-icons/io5";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { PiShareFatLight } from "react-icons/pi";
import { Clock, User, Building, Eye, Shield, Globe, FileSearch, Bot, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import NewsImage from "../../assets/NewsImage.png";
import { languageNames } from "../../Data/newAchorData";
import Button from "../Resusable/Button";
import CommentCard from "./Comment";
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";

const initialComments = [
  {
    name: "Arjun Mehta",
    time: "2025-07-08T12:15:00Z",
    content: "This surge is insane! Crypto is changing everything.",
    image: bg1,
    replies: [
      {
        name: "Sneha Rao",
        time: "2025-07-08T12:45:00Z",
        content: "Agreed! But I hope the market stabilizes soon.",
        image: bg2,
        replies: [],
      },
    ],
  },
  {
    name: "Rahul Verma",
    time: "2025-07-08T13:05:00Z",
    content: "Is this a bubble or real growth? Still skeptical.",
    image: bg1,
    replies: [
      {
        name: "Nisha Patel",
        time: "2025-07-08T13:20:00Z",
        content: "Institutional backing gives it some stability, IMO.",
        image: bg2,
        replies: [],
      },
      {
        name: "Dev Singh",
        time: "2025-07-08T13:30:00Z",
        content: "Yeah but long-term volatility is still a concern.",
        image: bg2,
        replies: [],
      },
    ],
  },
];

// const article = {
//   category: "Finance",
//   heading: "Bitcoin Surges Past $100K Amid Market Optimism",
//   author: "Linda Torres",
//   publisher: "Bloomberg",
//   image: NewsImage,
//   description:
//     "Bitcoin has reached a record-breaking $100,000 valuation following bullish investor sentiment and increasing institutional adoption of cryptocurrency. This milestone represents a significant moment in the evolution of digital assets, driven by widespread institutional acceptance and regulatory clarity in major markets. The surge comes after months of steady growth, with major corporations and investment funds continuing to add Bitcoin to their portfolios as a hedge against inflation and currency devaluation.",
//   language: "English",
// };

// {
// -"source": {
// "id": "cbs-news",
// "name": "CBS News"
// },
// "author": "Kaia  Hubbard, Kathryn  Watson",
// "title": "Watch Live: RFK Jr. testifies at Senate hearing today amid backlash over CDC turmoil, vaccine policies - CBS News",
// "description": "Health and Human Services Secretary Robert F. Kennedy Jr. defended firing the director of the CDC at a hearing before a Senate committee on Thursday.",
// "url": "https://www.cbsnews.com/live-updates/rfk-hearing-senate-finance-committee-cdc-vaccines/",
// "urlToImage": "https://assets1.cbsnewsstatic.com/hub/i/r/2025/09/04/1628a2dc-e3ad-461d-9d8c-1e529ddc1f1b/thumbnail/1200x630/2c09df8b4c37327982b0b03dfcb29748/ap25247508543738.jpg",
// "publishedAt": "2025-09-04T16:20:00Z",
// "content": "Sen. John Barrasso of Wyoming, a Republican and a physician, said he was \"deeply concerned\" about how Kennedy and the CDC's vaccine panel are approaching recommendations.\r\n\"Secretary Kennedy, in your… [+1913 chars]"
// },

const FullNews = () => {
   const { state } = useLocation();
  const article = state || {};
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1247);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(342);
  const [outputType, setOutputType] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summaryFormat, setSummaryFormat] = useState("paragraph");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [showSummary, setShowSummary] = useState(false);

  const handleToolClick = (type) => {
    if (outputType === type && showOutput) {
      setShowOutput(false);
      setOutputType("");
      return;
    }

    setOutputType(type);
    setShowOutput(type !== "translate");
    setLoading(false);
    setDone(false);
    setError("");

    if (type !== "translate") {
      setTimeout(() => {
        document.getElementById("output-box")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

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
      title: article.heading,
      text: article.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => toast.error("Share failed"));
    } else {
      navigator.clipboard.writeText(`${article.heading} - ${window.location.href}`);
      toast.success("Link copied to clipboard");
    }
  };

  const handleSubmit = async (type) => {
    if (type === "translate" && !selectedLanguage) {
      setError("Please select a target language.");
      return;
    }
    setLoading(true);
    setDone(false);
    setShowOutput(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDone(true);
      setTimeout(() => {
        document.getElementById("output-box")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newComment = {
      name: "You",
      time: new Date().toISOString(),
      content: replyText,
      image: "https://i.pravatar.cc/50?u=maincomment",
      replies: [],
    };
    setComments([newComment, ...comments]);
    setReplyText("");
  };

  const summaryMap = {
    bulletPoint: (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          Key Points
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            Bitcoin surpasses historic $100K milestone for the first time
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
            Strong institutional interest and corporate adoption drives growth
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
            Global market response remains positive with regulatory clarity
          </li>
        </ul>
      </div>
    ),
    paragraph: (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-green-500" />
          Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Bitcoin's recent surge past the $100,000 mark has marked a major milestone in cryptocurrency 
          history, driven by institutional backing and positive investor sentiment across global markets. 
          This achievement represents years of mainstream adoption and regulatory acceptance.
        </p>
      </div>
    ),
    keyHighlight: (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Eye className="w-4 h-4 text-orange-500" />
          Key Highlight
        </h3>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p className="text-orange-800 font-medium">
            Bitcoin hits $100K for the first time ever amid major economic shifts and widespread adoption by major institutions.
          </p>
        </div>
      </div>
    ),
  };

  const toolLabels = {
    fetchnews: { label: "Related News", icon: FileSearch, color: "blue" },
    factcheck: { label: "Fact Check", icon: Shield, color: "green" },
    biasDetect: { label: "Bias Detection", icon: Eye, color: "orange" },
    translate: { label: "Translate", icon: Globe, color: "purple" },
  };

  const outputComponents = {
    fetchnews: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-blue-500" />
          Related News Stories
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-1">Related Bitcoin Story {i}</h4>
              <p className="text-sm text-gray-600">Sample related content about cryptocurrency markets...</p>
            </div>
          ))}
        </div>
      </div>
    ),
    factcheck: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Fact Check Results
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Verified Information</span>
          </div>
          <p className="text-green-700">
            The claim about Bitcoin reaching $100K has been verified through multiple financial data sources 
            and exchange platforms. Market data confirms this milestone.
          </p>
        </div>
      </div>
    ),
    biasDetect: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-500" />
          Bias Analysis
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Overall Bias Score</span>
              <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm">Low</span>
            </div>
            <p className="text-orange-700 text-sm">
              The article maintains a neutral tone with factual reporting. Minor positive sentiment detected 
              but within acceptable journalistic standards.
            </p>
          </div>
        </div>
      </div>
    ),
    translate: done && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          Translated Content
        </h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">
            Output in {languageNames[selectedLanguage]}
          </h4>
          <p className="text-purple-700">
            [Mock translation content would appear here based on the selected language]
          </p>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Article Container */}
        <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={article.image}
                alt={article.heading}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Article Header */}
            <div className="p-8 lg:p-10 space-y-6">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {article.heading}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{article.publisher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {article.description}
                </p>
                <a href={article.url} className="text-blue-600 mb-4 leading-relaxed text-md">
                  {article.url}</a>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-8">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-200 active:scale-95"
                  >
                    {liked ? <FcLike size={24} /> : <IoHeartOutline size={24} />}
                    <span className="font-medium">{likesCount}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-all duration-200 active:scale-95"
                  >
                    {bookmarked ? <MdBookmark size={24} /> : <MdBookmarkBorder size={24} />}
                    <span className="font-medium">{bookmarkCount}</span>
                  </button>

                  <div className="flex items-center gap-2 text-gray-600">
                    <IoChatbubbleOutline size={24} />
                    <span className="font-medium">{comments.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  <PiShareFatLight size={24} />
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Summary Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-500" />
              AI Summary
            </h2>

            <div className="flex flex-wrap gap-3">
              {Object.keys(summaryMap).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (summaryFormat === key && showSummary) {
                      setShowSummary(false);
                    } else {
                      setSummaryFormat(key);
                      setShowSummary(true);
                      setShowOutput(false);
                    }
                  }}
                  className={`px-4 py-2 text-sm rounded-full font-medium border transition-all duration-200 ${
                    summaryFormat === key && showSummary
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {
                    {
                      bulletPoint: "Key Points",
                      paragraph: "Summary",
                      keyHighlight: "Highlights",
                    }[key]
                  }
                </button>
              ))}
            </div>

            {showSummary && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300">
                {summaryMap[summaryFormat]}
              </div>
            )}
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              AI Tools
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(toolLabels).map(([key, config]) => {
                const IconComponent = config.icon;
                const isActive = outputType === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => handleToolClick(key)}
                    className={`group p-4 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? `bg-${config.color}-600 text-white border-${config.color}-600 shadow-lg`
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : `text-${config.color}-500`}`} />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Translation Form */}
          {outputType === "translate" && (
            <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit("translate");
                }}
                className="space-y-4"
              >
                <label className="block text-sm font-semibold text-purple-800">
                  Select Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Choose language...</option>
                  {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                <Button
                  content={loading ? "Translating..." : "Translate Now"}
                  condition={!loading}
                  type="submit"
                />
                {error && (
                  <p className="text-red-600 font-medium text-sm">{error}</p>
                )}
              </form>
            </div>
          )}

          {/* AI Output */}
          {showOutput && (
            <div
              id="output-box"
              className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300"
            >
              {loading ? (
                <div className="flex justify-center items-center py-8 text-blue-600">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="font-semibold">Generating output...</span>
                </div>
              ) : (
                outputComponents[outputType]
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <IoChatbubbleOutline className="w-6 h-6 text-green-500" />
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your thoughts on this story..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  condition={true}
                  data={true}
                  content="Post Comment"
                  color={true}
                />
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <CommentCard key={index} comment={comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullNews;