// FullNews.jsx - Part 1: Imports and State Management
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHeartOutline, IoChatbubbleOutline } from "react-icons/io5";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { PiShareFatLight } from "react-icons/pi";
import {
  Clock,
  User,
  Building,
  Eye,
  Shield,
  Globe,
  FileSearch,
  Bot,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  generateNewsArticle,
  fetchNews as fetchRelatedNews,
  factCheckNews,
  biasDetection,
  translate,
  summarizer,
} from "../../Service/Operations/AiOperation";
import Button from "../Resusable/Button";

const FullNews = () => {
  const { state } = useLocation();
  const article = state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get token from localStorage with error handling
  const [token] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  });

  // Primary states
  const [news, setNews] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI Tool states
  const [outputType, setOutputType] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [done, setDone] = useState(false);
  const [aiResults, setAiResults] = useState({});

  // Translation states
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Summary states
  const [summaryFormat, setSummaryFormat] = useState("paragraph");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryResults, setSummaryResults] = useState({});

  // Language options - moved to useMemo for performance
  const languageNames = useMemo(() => ({
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
    tr: "Turkish",
    nl: "Dutch",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    pl: "Polish",
    cs: "Czech",
    hu: "Hungarian",
  }), []);

  // Tool configuration - moved to useMemo for performance
  const toolLabels = useMemo(() => ({
    fetchnews: { label: "Related News", icon: FileSearch, color: "blue" },
    factcheck: { label: "Fact Check", icon: Shield, color: "green" },
    biasDetect: { label: "Bias Detection", icon: Eye, color: "orange" },
    translate: { label: "Translate", icon: Globe, color: "purple" },
  }), []);

  // Color classes mapping - fixed template literal issue
  const getColorClasses = useCallback((color, isActive) => {
    const colorMap = {
      blue: isActive ? "bg-blue-600 border-blue-600 text-white" : "text-blue-500",
      green: isActive ? "bg-green-600 border-green-600 text-white" : "text-green-500",
      orange: isActive ? "bg-orange-600 border-orange-600 text-white" : "text-orange-500",
      purple: isActive ? "bg-purple-600 border-purple-600 text-white" : "text-purple-500",
    };
    return colorMap[color] || colorMap.blue;
  }, []);

  // Fetch news article content
  useEffect(() => {
    const fetchNewsContent = async () => {
      if (!article?.url || !token || !article?.title) {
        if (!token) {
          setError("Authentication required");
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const payload = {
          topic: article.title || article.heading,
          url: article.url,
        };

        const result = await dispatch(generateNewsArticle(payload, token));

        if (result?.payload?.data?.news) {
          setNews(result.payload.data.news);
        } else if (result?.data?.news) {
          setNews(result.data.news);
        } else {
          setError("No news content received");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to generate news content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsContent();
  }, [dispatch, article?.url, article?.title, token]);

  // Execute AI operations - improved with better error handling
  const executeAIOperation = useCallback(async (type) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        topic: article.title || article.heading,
        content: news || article.description,
        url: article.url,
      };

      let result;

      switch (type) {
        case "fetchnews":
          result = await dispatch(fetchRelatedNews(payload, token));
          break;
        case "factcheck":
          result = await dispatch(factCheckNews(payload, token));
          break;
        case "biasDetect":
          result = await dispatch(biasDetection(payload, token));
          break;
        default:
          throw new Error(`Unknown operation type: ${type}`);
      }

      if (result?.payload?.data || result?.data) {
        const data = result?.payload?.data || result?.data;
        setAiResults((prev) => ({ ...prev, [type]: data }));
        setDone(true);
      } else {
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error(`Error executing ${type}:`, error);
      setError(`Failed to execute ${type} operation. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [dispatch, article, news, token]);

  // Handle summary generation - improved with caching
  const generateSummary = useCallback(async (format) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // Check if summary already exists
    if (summaryResults[format]) {
      return;
    }

    try {
      const payload = {
        topic: article.title || article.heading,
        content: news || article.description,
        format: format,
      };

      const result = await dispatch(summarizer(payload, token));

      if (result?.payload?.data || result?.data) {
        const data = result?.payload?.data || result?.data;
        setSummaryResults((prev) => ({ ...prev, [format]: data }));
      } else {
        throw new Error("No summary data received");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("Failed to generate summary. Please try again.");
    }
  }, [token, article, news, dispatch, summaryResults]);

// FullNews.jsx - Part 2: Event Handlers and Component

  // Handle tool clicks - improved logic
  const handleToolClick = useCallback(async (type) => {
    // Toggle off if same tool is clicked
    if (outputType === type && showOutput) {
      setShowOutput(false);
      setOutputType("");
      setError("");
      return;
    }

    setOutputType(type);
    setShowOutput(type !== "translate");
    setLoading(false);
    setDone(false);
    setError("");

    // Scroll to output for non-translate tools
    if (type !== "translate") {
      setTimeout(() => {
        const outputElement = document.getElementById("output-box");
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      // Execute AI operation
      await executeAIOperation(type);
    }
  }, [outputType, showOutput, executeAIOperation]);

  // Handle translation - improved validation
  const handleTranslate = useCallback(async (e) => {
    e.preventDefault();

    if (!selectedLanguage) {
      setError("Please select a target language.");
      return;
    }

    if (!token) {
      setError("Authentication required.");
      return;
    }

    setLoading(true);
    setDone(false);
    setShowOutput(true);
    setError("");

    try {
      const payload = {
        topic: article.title || article.heading,
        content: news || article.description,
        language: selectedLanguage,
      };

      const result = await dispatch(translate(payload, token));

      if (result?.payload?.data || result?.data) {
        const data = result?.payload?.data || result?.data;
        setAiResults((prev) => ({ ...prev, translate: data }));
        setDone(true);

        setTimeout(() => {
          const outputElement = document.getElementById("output-box");
          if (outputElement) {
            outputElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        throw new Error("No translation data received");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, token, article, news, dispatch]);

  // Handle summary format change - improved
  const handleSummaryFormat = useCallback(async (format) => {
    if (summaryFormat === format && showSummary) {
      setShowSummary(false);
      return;
    }

    setSummaryFormat(format);
    setShowSummary(true);
    setShowOutput(false);

    if (!summaryResults[format]) {
      await generateSummary(format);
    }
  }, [summaryFormat, showSummary, summaryResults, generateSummary]);

  // Output components - memoized for performance
  const outputComponents = useMemo(() => ({
    fetchnews: aiResults.fetchnews && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-blue-500" />
          Related News Stories
        </h3>
        <div className="space-y-3">
          {aiResults.fetchnews.articles?.length > 0 ? (
            aiResults.fetchnews.articles.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Read more
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No related news found.</p>
          )}
        </div>
      </div>
    ),

    factcheck: aiResults.factcheck && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Fact Check Results
        </h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              {aiResults.factcheck.status || "Verification Status"}
            </span>
          </div>
          <p className="text-green-700">
            {aiResults.factcheck.summary || aiResults.factcheck.result ||
              "Fact check results will be displayed here..."}
          </p>
        </div>
      </div>
    ),

    biasDetect: aiResults.biasDetect && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-500" />
          Bias Analysis
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">
                Overall Bias Score
              </span>
              <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm">
                {aiResults.biasDetect.score || "Analyzing..."}
              </span>
            </div>
            <p className="text-orange-700 text-sm">
              {aiResults.biasDetect.analysis || aiResults.biasDetect.result ||
                "Bias analysis results will be displayed here..."}
            </p>
          </div>
        </div>
      </div>
    ),

    translate: done && aiResults.translate && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          Translated Content
        </h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">
            Output in {languageNames[selectedLanguage]}
          </h4>
          <p className="text-purple-700 whitespace-pre-wrap">
            {aiResults.translate.translatedText || aiResults.translate.result ||
              "Translation will appear here..."}
          </p>
        </div>
      </div>
    ),
  }), [aiResults, done, languageNames, selectedLanguage]);

  // Summary components - memoized for performance
  const summaryMap = useMemo(() => ({
    bulletPoint: summaryResults.bulletPoint && (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          Key Points
        </h3>
        <ul className="space-y-2 text-gray-700">
          {summaryResults.bulletPoint.points?.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>{point}</span>
            </li>
          )) || (
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                {summaryResults.bulletPoint.summary || summaryResults.bulletPoint.result ||
                  "Key points will appear here..."}
              </span>
            </li>
          )}
        </ul>
      </div>
    ),

    paragraph: summaryResults.paragraph && (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-green-500" />
          Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {summaryResults.paragraph.summary || summaryResults.paragraph.result || 
            "Summary will appear here..."}
        </p>
      </div>
    ),

    keyHighlight: summaryResults.keyHighlight && (
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Eye className="w-4 h-4 text-orange-500" />
          Key Highlight
        </h3>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p className="text-orange-800 font-medium">
            {summaryResults.keyHighlight.highlight || summaryResults.keyHighlight.result ||
              "Key highlights will appear here..."}
          </p>
        </div>
      </div>
    ),
  }), [summaryResults]);

  // Early return for missing article
  if (!article.title && !article.heading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Article Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Article Container */}
        <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            {/* Hero Image */}
            {article.image && (
              <div className="relative h-96 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.heading || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.height = 'auto';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                {article.category && (
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      {article.category}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Article Header */}
            <div className="p-8 lg:p-10 space-y-6">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {article.heading || article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                )}
                {article.publisher && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{article.publisher}</span>
                  </div>
                )}
                {article.date && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {article.description && (
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {article.description}
                  </p>
                )}
                {news && (
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {news}
                  </p>
                )}
                {article.url && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 mb-4 leading-relaxed text-md hover:underline"
                  >
                    Read original article
                  </a>
                )}
              </div>

             
            </div>
          </div>
        </article>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

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
                  onClick={() => handleSummaryFormat(key)}
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
                    disabled={loading}
                    className={`group p-4 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isActive 
                        ? getColorClasses(config.color, true)
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : getColorClasses(config.color, false)
                        }`}
                      />
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
              <form onSubmit={handleTranslate} className="space-y-4">
                <label className="block text-sm font-semibold text-purple-800">
                  Select Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                >
                  <option value="">Choose language...</option>
                  {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
                <Button
                  content={loading ? "Translating..." : "Translate Now"}
                  condition={!loading && selectedLanguage}
                  type="submit"
                />
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
                  <svg
                    className="animate-spin h-6 w-6 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span className="font-semibold">Generating output...</span>
                </div>
              ) : (
                outputComponents[outputType]
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullNews;