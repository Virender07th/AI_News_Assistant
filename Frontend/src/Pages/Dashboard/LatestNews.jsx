import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopHeadlines } from "../../Service/Operations/NewsAPI";
import NewsCard from "../../Components/Resusable/NewsCard";
import { Search, Filter, Globe, Tag, RefreshCw } from "lucide-react";

const languageOptions = {
  de: "German",
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  ru: "Russian",
  ud: "Urdu",
  zh: "Chinese",
};

const categoryOptions = {
  general: "General",
  business: "Business",
  entertainment: "Entertainment",
  health: "Health",
  science: "Science",
  sports: "Sports",
  technology: "Technology",
};

const LatestNews = () => {
  const dispatch = useDispatch();
  const { newses } = useSelector((state) => state.news); // ✅ get from redux
  const { token } = useSelector((state) => state.auth);
  const [languageFilter, setLanguageFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  console.log(newses);
  
  const hasActiveFilters = languageFilter || categoryFilter;

  useEffect(() => {
    dispatch(
      getTopHeadlines(token, {
        language: languageFilter || undefined,
        category: categoryFilter || undefined,
      })
    );
  }, [dispatch, token, languageFilter, categoryFilter]);

  const clearFilters = () => {
    setLanguageFilter("");
    setCategoryFilter("");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Today's Top Stories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-6 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Language Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe className="w-4 h-4" />
                  Language
                </label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Languages</option>
                  {Object.entries(languageOptions).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {Object.entries(categoryOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* News Cards Grid */}
        <div className="space-y-4 lg:space-y-8">
          {newses && newses.length > 0 ? (
            newses.map((item, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:scale-[1.02]"
              >
                <NewsCard
                  heading={item.title || "Untitled"}
                  description={item.description || "No description available."}
                  image={item.urlToImage || "/fallback-news.jpg"} // ✅ fallback
                  author={
                    item.author && item.author.trim() !== ""
                      ? item.author
                      : "Unknown"
                  }
                  publisher={item.source?.name || "Unknown Source"}
                  category={categoryFilter || "General"}
                  btns={true}
                  date={item.publishedAt || "few hour ago"}
                  url={item.url} // ✅ you can make NewsCard button open this
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No news found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
