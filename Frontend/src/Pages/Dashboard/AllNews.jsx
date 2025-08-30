import React, { useState } from 'react';
import NewsCard from '../../Components/Resusable/NewsCard';
import NewsImage from '../../assets/bg2.jpg';
import InputField from '../../Components/Resusable/InputField';
import { Search, Filter, Globe, Tag, RefreshCw, TrendingUp } from 'lucide-react';

const newsData = [
  {
    category: "AI",
    heading: "OpenAI Releases GPT-5 With Major Upgrades",
    author: "Sophia Lee",
    publisher: "TechCrunch",
    image: NewsImage,
    description:
      "OpenAI has officially launched GPT-5, its most powerful language model to date, offering significant improvements in reasoning, multilingual support, and safety features that set new industry standards.",
    language: "English"
  },
  {
    category: "Space",
    heading: "NASA Discovers Potentially Habitable Exoplanet",
    author: "James Carter",
    publisher: "NASA Newsroom",
    image: NewsImage,
    description:
      "Astronomers at NASA have identified a new Earth-sized exoplanet located in the habitable zone, raising hopes for potential life beyond our solar system with promising atmospheric conditions.",
    language: "English"
  },
  {
    category: "Cybersecurity",
    heading: "Global Ransomware Attack Hits Over 50 Countries",
    author: "Aisha Khan",
    publisher: "CyberWire",
    image: NewsImage,
    description:
      "A coordinated ransomware attack has affected critical infrastructure in over 50 countries, prompting emergency responses from global cybersecurity agencies and international cooperation efforts.",
    language: "English"
  },
  {
    category: "Healthcare",
    heading: "AI Diagnoses Rare Diseases With 90% Accuracy",
    author: "Dr. Rajiv Sharma",
    publisher: "Medical AI Weekly",
    image: NewsImage,
    description:
      "Researchers have developed an AI system that can accurately diagnose over 200 rare conditions, potentially revolutionizing early detection in medicine and improving patient outcomes worldwide.",
    language: "Hindi"
  },
  {
    category: "Finance",
    heading: "Bitcoin Surges Past $100K Amid Market Optimism",
    author: "Linda Torres",
    publisher: "Bloomberg",
    image: NewsImage,
    description:
      "Bitcoin has reached a record-breaking $100,000 valuation following bullish investor sentiment and increasing institutional adoption of cryptocurrency across major financial markets.",
    language: "English"
  }
];

const languageOptions = ["English", "Hindi"];
const categoryOptions = ["AI", "Space", "Cybersecurity", "Healthcare", "Finance"];

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNews = newsData.filter((item) => {
    const matchesSearch =
      item.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage = languageFilter ? item.language === languageFilter : true;
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;

    return matchesSearch && matchesLanguage && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setLanguageFilter('');
    setCategoryFilter('');
  };

  const hasActiveFilters = searchTerm || languageFilter || categoryFilter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-300" />
              <Globe className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">Explore</span>
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                All News
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
              Discover comprehensive news coverage from around the world, powered by AI journalism
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">{newsData.length}</div>
                <div className="text-blue-200">Total Articles</div>
              </div>
              <div className="w-px h-8 bg-blue-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">{categoryOptions.length}</div>
                <div className="text-blue-200">Categories</div>
              </div>
              <div className="w-px h-8 bg-blue-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">{languageOptions.length}</div>
                <div className="text-blue-200">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 lg:p-8 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
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
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
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
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? 'Filtered Results' : 'All Articles'}
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {/* Sort Options */}
          <select className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="space-y-8">
            {filteredNews.map((item, index) => (
              <div
                key={index}
                className="transform transition-all duration-500 hover:scale-[1.01]"
              >
                <NewsCard
                  heading={item.heading}
                  description={item.description}
                  image={item.image}
                  author={item.author}
                  publisher={item.publisher}
                  category={item.category}
                  btns={true}
                />
              </div>
            ))}

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <span>Load More Articles</span>
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Quick Filter Tags */}
        {!hasActiveFilters && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-500" />
              Quick Filters
            </h3>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 text-sm font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;