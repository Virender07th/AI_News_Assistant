import React, { useState } from "react";
import { aiJournalistagentData } from "../../Data/agentData";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import { 
  Bot, 
  Sparkles, 
  Clock, 
  Eye, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp,
  ChevronRight,
  Zap,
  RefreshCw
} from "lucide-react";

const AiJournalistDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock stats for demonstration
  const stats = [
    { label: "Articles Generated", value: "1,247", icon: Bot, color: "blue" },
    { label: "Active Agents", value: "12", icon: Zap, color: "green" },
    { label: "Topics Covered", value: "156", icon: TrendingUp, color: "purple" },
    { label: "Avg. Generation Time", value: "2.3s", icon: Clock, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-cyan-300" />
              <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">AI Journalist</span>
              <span className="block bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
              Manage and monitor your AI-powered journalism agents creating intelligent, fact-checked content
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            );
          })}
        </div>

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Content Library</h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="all">All Articles</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="reviewing">Under Review</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>

              {/* Refresh Button */}
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="space-y-8">
          {aiJournalistagentData && aiJournalistagentData.length > 0 ? (
            aiJournalistagentData.map((item, index) => (
              <article
                key={item.id || item.heading || index}
                className="group relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`relative ${viewMode === 'list' ? 'flex flex-col lg:flex-row' : 'flex flex-col'}`}>
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' 
                      ? 'lg:w-80 h-64 lg:h-auto' 
                      : 'w-full h-64 sm:h-80'
                  }`}>
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.heading || "AI Generated News"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        <Bot className="w-3 h-3 mr-1" />
                        AI Generated
                      </span>
                    </div>

                    {/* Reading Time */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        3 min read
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                        {item.heading}
                      </h2>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                        {item.content}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          2.4k views
                        </span>
                        <span>•</span>
                        <span>Generated 2 hours ago</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">Published</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                      <div className="flex items-center gap-3">
                        <Button
                          content="Read Article"
                          data={true}
                          condition={true}
                          color={false}
                          click={() => navigate(item.route)}
                        />
                        
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                      </div>

                      <button className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                        <span className="text-sm">View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            /* Enhanced Empty State */
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/60 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No AI Articles Yet
                </h3>
                
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  Your AI journalist agents haven't created any articles yet. Start by configuring your first agent to begin generating intelligent news content.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <Bot className="w-5 h-5" />
                    Create Agent
                  </button>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <RefreshCw className="w-5 h-5" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Load More Section */}
          {aiJournalistagentData && aiJournalistagentData.length > 0 && (
            <div className="text-center mt-12">
              <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <span>Load More Articles</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-40">
          <button className="group p-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-violet-500/25 transform hover:scale-110 transition-all duration-300">
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiJournalistDashboard;