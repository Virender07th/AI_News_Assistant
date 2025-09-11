// FullNews.jsx - Complete updated version with persistent AI tool sections
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
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  generateNewsArticle,
  fetchNews as fetchRelatedNews,
  factCheckNews,
  biasDetection,
  translate,
  summarizer,
} from "../../Service/Operations/AiOperation";
import Button from "../Resusable/Button";
import ReactMarkdown from 'react-markdown';

const FullNews = () => {
  const { state } = useLocation();
  const article = state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { token } = useSelector((state) => state.auth); 

  // Primary states
  const [news, setNews] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI Tool states - Updated for persistent sections
  const [aiResults, setAiResults] = useState({});
  const [loadingTools, setLoadingTools] = useState({});

  // Translation states
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showTranslateForm, setShowTranslateForm] = useState(false);

  // Summary states
  const [summaryFormat, setSummaryFormat] = useState("paragraph");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryResults, setSummaryResults] = useState({});

  // Helper function to get bias level styling
  const getBiasLevel = useCallback((score) => {
    if (score < 30) return { level: "Low", color: "green", bg: "bg-green-50", border: "border-green-200" };
    if (score < 60) return { level: "Moderate", color: "yellow", bg: "bg-yellow-50", border: "border-yellow-200" };
    return { level: "High", color: "red", bg: "bg-red-50", border: "border-red-200" };
  }, []);

  // Helper function to get fact check verdict styling
  const getVerdictStyle = useCallback((verdict) => {
    switch (verdict?.toUpperCase()) {
      case "TRUE":
        return { 
          level: "TRUE", 
          color: "green", 
          bg: "bg-green-50", 
          border: "border-green-200", 
          icon: CheckCircle,
          textColor: "text-green-800",
          badgeColor: "bg-green-100"
        };
      case "MOSTLY TRUE":
        return { 
          level: "MOSTLY TRUE", 
          color: "blue", 
          bg: "bg-blue-50", 
          border: "border-blue-200", 
          icon: CheckCircle,
          textColor: "text-blue-800",
          badgeColor: "bg-blue-100"
        };
      case "MIXED":
        return { 
          level: "MIXED", 
          color: "yellow", 
          bg: "bg-yellow-50", 
          border: "border-yellow-200", 
          icon: AlertTriangle,
          textColor: "text-yellow-800",
          badgeColor: "bg-yellow-100"
        };
      default:
        return { 
          level: "FALSE", 
          color: "red", 
          bg: "bg-red-50", 
          border: "border-red-200", 
          icon: AlertTriangle,
          textColor: "text-red-800",
          badgeColor: "bg-red-100"
        };
    }
  }, []);

  // Language options
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

  // Tool configuration
  const toolLabels = useMemo(() => ({
    fetchnews: { label: "Related News", icon: FileSearch, color: "blue" },
    factcheck: { label: "Fact Check", icon: Shield, color: "green" },
    biasDetect: { label: "Bias Detection", icon: Eye, color: "orange" },
    translate: { label: "Translate", icon: Globe, color: "purple" },
  }), []);

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
        
        if (result?.data?.news) {
          setNews(result.data.news);
        } else if (result?.payload?.data?.news) {
          setNews(result.payload.data.news);
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

  // Execute AI operations - Updated for persistent sections
  const executeAIOperation = useCallback(async (type) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    // Don't run if already have results for this tool
    if (aiResults[type]) {
      return;
    }

    setLoadingTools(prev => ({ ...prev, [type]: true }));
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
      } else {
        throw new Error("No data received from API");
      }
    } catch (error) {
      console.error(`Error executing ${type}:`, error);
      setError(`Failed to execute ${type} operation. Please try again.`);
    } finally {
      setLoadingTools(prev => ({ ...prev, [type]: false }));
    }
  }, [dispatch, article, news, token, aiResults]);

  // Handle summary generation
  const generateSummary = useCallback(async (format) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

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

  // Handle tool clicks - Updated for persistent sections
  const handleToolClick = useCallback(async (type) => {
    if (type === "translate") {
      setShowTranslateForm(!showTranslateForm);
      return;
    }

    // Execute AI operation (will only run if no results exist)
    await executeAIOperation(type);
  }, [executeAIOperation, showTranslateForm]);

  // Handle translation
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

    setLoadingTools(prev => ({ ...prev, translate: true }));
    setError("");

    try {
      const payload = {
        topic: article.title || article.heading,
        content: news || article.description,
        language: selectedLanguage,
      };

      const result = await dispatch(translate(payload, token));

      if (result?.data || result?.payload?.data) {
        const data = result?.data || result?.payload?.data;
        setAiResults((prev) => ({ ...prev, translate: data }));
      } else {
        throw new Error("No translation data received");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError("Translation failed. Please try again.");
    } finally {
      setLoadingTools(prev => ({ ...prev, translate: false }));
    }
  }, [selectedLanguage, token, article, news, dispatch]);

  // Handle summary format change
  const handleSummaryFormat = useCallback(async (format) => {
    if (summaryFormat === format && showSummary) {
      setShowSummary(false);
      return;
    }

    setSummaryFormat(format);
    setShowSummary(true);

    if (!summaryResults[format]) {
      await generateSummary(format);
    }
  }, [summaryFormat, showSummary, summaryResults, generateSummary]);

  // Helper functions for bias detection colors
  const getIconColorClass = useCallback((color) => {
    const colorClasses = {
      green: 'text-green-600',
      yellow: 'text-yellow-600', 
      red: 'text-red-600'
    };
    return colorClasses[color] || 'text-gray-600';
  }, []);

  const getBadgeColorClasses = useCallback((color) => {
    const badgeClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };
    return badgeClasses[color] || 'bg-gray-100 text-gray-800';
  }, []);

  // Summary components
  const summaryMap = useMemo(() => {
    const getBulletPoints = (data) => {
      if (!data) return [];
      if (Array.isArray(data.summary)) return data.summary;
      if (Array.isArray(data.bulletPoint)) return data.bulletPoint;
      if (typeof data.summary === "string") {
        return data.summary.split("\n").filter((point) => point.trim());
      }
      if (typeof data.bulletPoint === "string") {
        return data.bulletPoint.split("\n").filter((point) => point.trim());
      }
      return [];
    };

    const getHighlights = (data) => {
      if (!data) return [];
      if (Array.isArray(data.summary)) return data.summary;
      if (Array.isArray(data.keyHighlight)) return data.keyHighlight;
      if (typeof data.keyHighlight === "string") {
        return data.keyHighlight.split("\n").filter((point) => point.trim());
      }
      return [];
    };

    const getParagraphSummary = (data) => {
      if (!data) return "";
      return (
        data.summary ||
        data.result ||
        data.paragraph?.summary ||
        data.paragraph?.result ||
        ""
      );
    };

    const bullets = getBulletPoints(summaryResults?.bulletPoint);
    const highlights = getHighlights(summaryResults?.keyHighlight);

    return {
      bulletPoint:
        bullets.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Key Points
            </h3>
            <div className="space-y-2">
              {summaryResults?.bulletPoint?.wordCount && (
                <div className="text-sm text-gray-500 mb-3">
                  {summaryResults.bulletPoint.wordCount} words •{" "}
                  {summaryResults.bulletPoint.readingTime}
                </div>
              )}
              <ul className="space-y-3">
                {bullets.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),

      paragraph:
        summaryResults?.paragraph && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-green-500" />
              Summary
            </h3>
            {summaryResults.paragraph?.wordCount && (
              <div className="text-sm text-gray-500">
                {summaryResults.paragraph.wordCount} words •{" "}
                {summaryResults.paragraph.readingTime}
              </div>
            )}
            <p className="text-gray-700 leading-relaxed">
              {getParagraphSummary(summaryResults.paragraph)}
            </p>
          </div>
        ),

      keyHighlight:
        highlights.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              Key Highlights
            </h3>
            <div className="space-y-2">
              {summaryResults?.keyHighlight?.wordCount && (
                <div className="text-sm text-gray-500 mb-3">
                  {summaryResults.keyHighlight.wordCount} words •{" "}
                  {summaryResults.keyHighlight.readingTime}
                </div>
              )}
              <ul className="space-y-3">
                {highlights.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
    };
  }, [summaryResults]);

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
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              AI Tools
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(toolLabels).map(([key, config]) => {
                const IconComponent = config.icon;
                const hasResults = aiResults[key];
                const isLoading = loadingTools[key];

                return (
                  <button
                    key={key}
                    onClick={() => handleToolClick(key)}
                    disabled={isLoading}
                    className={`group p-4 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative ${
                      hasResults
                        ? `bg-${config.color}-50 border-${config.color}-300 text-${config.color}-700`
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                    } ${key === "translate" && showTranslateForm ? `bg-${config.color}-100 border-${config.color}-400` : ""}`}
                  >
                    {/* Results indicator */}
                    {hasResults && (
                      <div className={`absolute -top-2 -right-2 w-4 h-4 bg-${config.color}-500 rounded-full flex items-center justify-center`}>
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent
                        className={`w-6 h-6 ${
                          hasResults ? `text-${config.color}-600` : `text-${config.color}-500`
                        }`}
                      />
                      <span className="text-sm font-medium">{config.label}</span>
                      {isLoading && (
                        <span className="text-xs text-gray-500">Loading...</span>
                      )}
                      {hasResults && !isLoading && (
                        <span className="text-xs opacity-75">Completed</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Translation Form */}
            {showTranslateForm && (
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-xl">
                <form onSubmit={handleTranslate} className="space-y-4">
                  <label className="block text-sm font-semibold text-purple-800">
                    Select Target Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loadingTools.translate}
                  >
                    <option value="">Choose language...</option>
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <Button
                    content={loadingTools.translate ? "Translating..." : "Translate Now"}
                    condition={!loadingTools.translate && selectedLanguage}
                    type="submit"
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        {/* AI Tool Results Sections - Persistent sections for each tool */}
        
        {/* Related News Section */}
        {aiResults.fetchnews && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileSearch className="w-6 h-6 text-blue-500" />
                Related News Stories
              </h3>
              <div className="space-y-3">
                {aiResults.fetchnews.articles?.length > 0 ? (
                  aiResults.fetchnews.articles.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-blue-900 mb-2">{item.title}</h4>
                      <p className="text-blue-700 text-sm mb-3">{item.description}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1"
                        >
                          Read more
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No related news found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fact Check Section */}
        {aiResults.factcheck && (() => {
          const factData = aiResults.factcheck;
          const verdictStyle = getVerdictStyle(factData.verdict);
          const VerdictIcon = verdictStyle.icon;

          return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-500" />
                  Fact Check Results
                </h3>
                
                {/* Overall Verdict */}
                <div className={`${verdictStyle.bg} ${verdictStyle.border} border-2 rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <VerdictIcon className={`w-6 h-6 text-${verdictStyle.color}-600`} />
                      Fact Check Verdict
                    </h4>
                    <span className={`px-4 py-2 ${verdictStyle.badgeColor} ${verdictStyle.textColor} font-bold rounded-full text-sm`}>
                      {verdictStyle.level}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 mb-4">
                        The content is assessed as <strong>{factData.verdict?.toLowerCase() || 'under review'}</strong>
                        {factData.overallScore && ` with a truth score of ${factData.overallScore}%`}. 
                        {factData.confidence && ` Our analysis shows ${factData.confidence}% confidence in this assessment.`}
                      </p>
                      {factData.summary && (
                        <p className="text-gray-700 mb-4">{factData.summary}</p>
                      )}
                      {factData.reasoning && (
                        <p className="text-gray-700">{factData.reasoning}</p>
                      )}
                    </div>
                    {factData.categories && (
                      <div className="space-y-4">
                        <div className="text-sm font-medium text-gray-600">Verification Breakdown:</div>
                        {Object.entries(factData.categories).map(([category, score]) => (
                          <div key={category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize font-medium">{category} Accuracy</span>
                              <span className="font-bold">{score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${
                                  score > 80 
                                    ? 'from-green-400 to-green-500' 
                                    : score > 60 
                                      ? 'from-yellow-400 to-yellow-500'
                                      : 'from-red-400 to-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sources Table */}
                {factData.sources && factData.sources.length > 0 && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-white border-b border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ExternalLink className="text-blue-600" size={20} />
                        Verified Sources ({factData.sources.length})
                      </h4>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-sm">
                        <thead className="bg-white sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Source</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Domain</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Credibility</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {factData.sources.map((source, index) => (
                            <tr key={index} className="hover:bg-white/50 transition-colors">
                              <td className="px-6 py-3 font-medium text-gray-900">
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {source.title || source.url}
                                </a>
                              </td>
                              <td className="px-6 py-3 text-blue-600 font-mono text-xs">
                                {source.url ? new URL(source.url).hostname : 'N/A'}
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    (source.credibility || 75) > 90 ? 'bg-green-500' : 
                                    (source.credibility || 75) > 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                  <span className="font-semibold">{source.credibility || 75}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Bias Detection Section */}
        {aiResults.biasDetect && (() => {
          const biasData = aiResults.biasDetect.biasData || aiResults.biasDetect;
          const overallScore = biasData.overallScore || 0;
          const biasStyle = getBiasLevel(overallScore);

          return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-orange-500" />
                  Bias Detection Analysis
                </h3>
                
                {/* Overall Bias Score */}
                <div className={`${biasStyle.bg} ${biasStyle.border} border-2 rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Eye className={`w-6 h-6 ${getIconColorClass(biasStyle.color)}`} />
                      Overall Bias Assessment
                    </h4>
                    <span className={`px-4 py-2 ${getBadgeColorClasses(biasStyle.color)} font-bold rounded-full text-sm`}>
                      {biasStyle.level} ({overallScore}%)
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 mb-4">
                        The content shows <strong>{biasStyle.level.toLowerCase()}</strong> bias with an overall score of {overallScore}%. 
                        {biasData.confidence && ` Analysis confidence: ${biasData.confidence}%`}
                      </p>
                      {biasData.sentiment && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-600">Sentiment: </span>
                          <span className={`font-semibold capitalize ${
                            biasData.sentiment.includes('positive') ? 'text-green-600' :
                            biasData.sentiment.includes('negative') ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {biasData.sentiment}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bias Categories Breakdown */}
                    {biasData.categories && (
                      <div className="space-y-4">
                        <div className="text-sm font-medium text-gray-600">Bias Category Analysis:</div>
                        {Object.entries(biasData.categories).map(([category, score]) => (
                          <div key={category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize font-medium">{category} Bias</span>
                              <span className="font-bold">{score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${
                                  score < 30 
                                    ? 'from-green-400 to-green-500' 
                                    : score < 60 
                                      ? 'from-yellow-400 to-yellow-500'
                                      : 'from-red-400 to-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Biased Phrases */}
                {biasData.keyPhrases && biasData.keyPhrases.length > 0 && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-orange-600" size={20} />
                      Potentially Biased Language ({biasData.keyPhrases.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {biasData.keyPhrases.map((phrase, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mt-3">
                      These phrases may indicate emotional or political bias in the content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Translation Section */}
        {aiResults.translate && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-500" />
                Translated Content
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-800 mb-4">
                  Output in {languageNames[selectedLanguage]}
                </h4>
                <div className="text-purple-700 prose max-w-none">
                  <ReactMarkdown>
                    {aiResults.translate.translatedText || aiResults.translate.result || "Translation will appear here..."}
                  </ReactMarkdown> 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullNews;