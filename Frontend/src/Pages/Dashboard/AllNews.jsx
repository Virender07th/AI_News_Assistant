import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEverythings, getGoogleNews } from "../../Service/Operations/NewsAPI";
import NewsCard from "../../Components/Resusable/NewsCard";
import { Search, Filter, Globe, Tag, RefreshCw } from "lucide-react";

const languageOptions = {
  de: "German", en: "English", hi: "Hindi", es: "Spanish",
  fr: "French", it: "Italian", ru: "Russian", ud: "Urdu", zh: "Chinese",
};

const categoryOptions = {
  general: "General",
  business: "Business",
  entertainment: "Entertainment",
  health: "Health",
  science: "Science",
  sports: "Sports",
  technology: "Technology",
  world: "World",
  politics: "Politics",
  environment: "Environment",
  education: "Education",
  lifestyle: "Lifestyle",
  travel: "Travel",
  food: "Food",
  automobile: "Automobile",
  military: "Military",
  crime: "Crime",
  opinion: "Opinion"
};

const AllNews = () => {
  const { newses } = useSelector((state) => state.news);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [source, setSource] = useState("google");

  const handleSearch = () => {
    const filters = {
      qSearch: searchTerm || undefined,
      language: languageFilter || undefined,
      categories: categoryFilter || undefined,
    };

    console.log("Applied Filters:", filters);

    if (source === "everything") {
      dispatch(getEverythings(token, filters));
    } else {
      dispatch(getGoogleNews(token, filters));
    }
  };

  // Trigger search whenever filters or source change
  useEffect(() => {
    handleSearch();
  }, [source, languageFilter, categoryFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setLanguageFilter("");
    setCategoryFilter("");
    handleSearch();
  };

  const hasActiveFilters = searchTerm || languageFilter || categoryFilter;

  // Use API results directly; no local filtering
  const displayedNews = newses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-4 mb-8">
          <div className="relative flex gap-2 mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, authors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Search
            </button>
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
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
                <RefreshCw className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe className="w-4 h-4" /> Language
                </label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option value="">All Languages</option>
                  {Object.entries(languageOptions).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4" /> Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full  border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option value="">All Categories</option>
                  {Object.entries(categoryOptions).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="everything"
                    checked={source === "everything"}
                    onChange={(e) => setSource(e.target.value)}
                  />
                  NewsAPI Everything
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="google"
                    checked={source === "google"}
                    onChange={(e) => setSource(e.target.value)}
                  />
                  Google News
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {hasActiveFilters ? "Filtered Results" : "All Articles"}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {displayedNews.length} {displayedNews.length !== 0 ? "article" : "articles"}
          </span>
        </div>

        {displayedNews.length > 0 ? (
          <div className="space-y-8">
            {displayedNews.map((item) => (
              <NewsCard
                key={item.url}
                heading={item.heading}
                description={item.description}
                image={item.image}
                author={item.author}
                publisher={item.publisher}
                category={item.category}
                btns={true}
                url={item.url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No articles found</h3>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" /> Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;
