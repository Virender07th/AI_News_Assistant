import React, { useState , useEffect } from "react";
import { aiJournalistagentData } from "../../Data/agentData";
import Button from "../../Components/Resusable/Button";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Eye,
  Grid3X3,
  List,
  TrendingUp,
  RefreshCw,
  Shield,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStats } from "../../Service/Operations/ProfileAPI";



const AiJournalistDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'

  const dispatch = useDispatch();
  const { stats = {} } = useSelector((state) => state.dashboard || {}); // fallback
  const { loading } = useSelector((state) => state.auth || {});
  const token = localStorage.getItem("token");

  console.log("token" , token);
  

  useEffect(() => {
    if (token) {
      dispatch(fetchUserStats(token));
    }
  }, [dispatch, token]);

  console.log("activity" , stats);
  const detailCard = [
    {
      title: "News Fetch & Scrape Agent",
      number: stats.fetchNews,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Multilingual Translator Agent",
      number: stats.translate,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Fact-Checking Agent",
      number: stats.factCheck,
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Bias Detection Agent",
      number: stats.biasDetection,
      icon: Eye,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Summary Agent",
      number: stats.summary,
      icon: Bot,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {detailCard.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden ${card.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-full ${card.bgColor} ring-2 ring-white shadow-md`}
                  >
                    <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 leading-tight">
                      {card.title}
                    </h3>
                    <p className={`text-3xl font-bold ${card.textColor} mt-1`}>
                      {card.number}
                    </p>
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
              <h2 className="text-xl font-semibold text-gray-900">
                Content Library
              </h2>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

                  <div
                    className={`relative ${
                      viewMode === "list"
                        ? "flex flex-col lg:flex-row"
                        : "flex flex-col"
                    }`}
                  >
                    {/* Image Section */}
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "list"
                          ? "lg:w-80 h-64 lg:h-auto"
                          : "w-full h-64 sm:h-80"
                      }`}
                    >
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
                          <span>Generated 2 hours ago</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                        <div className="flex items-center gap-3">
                          <Button
                            content="Use Agent"
                            data={true}
                            condition={true}
                            color={false}
                            click={() => navigate(item.route)}
                          />
                        </div>
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
                    Your AI journalist agents haven't created any articles yet.
                    Start by configuring your first agent to begin generating
                    intelligent news content.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiJournalistDashboard;
