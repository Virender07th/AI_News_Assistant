import React, { useState, useEffect } from "react";
import { Globe, Clock, Send, CheckCircle, TrendingUp, Newspaper, Zap, Calendar } from "lucide-react";

// Mock news data with enhanced properties
const mockNewsData = [
  {
    id: 1,
    title: "Neuralink Begins Human Trials with Brain Chip Implant",
    description: "Elon Musk's Neuralink has initiated human trials of its brain-chip technology, enabling basic computer interaction using neural signals.",
    summary: "Revolutionary brain-computer interface shows promising results in early human testing phase.",
    tone: "Positive",
    language: "English",
    category: "AI",
    source: "TechCrunch",
    publishedAt: "2 hours ago",
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Meta Sued Over Unauthorized Use of AI Training Data",
    description: "Meta faces legal action for allegedly training its LLaMA models on copyrighted content without obtaining user consent.",
    summary: "Legal challenges mount as AI companies face scrutiny over training data practices.",
    tone: "Negative",
    language: "English",
    category: "Legal",
    source: "Reuters",
    publishedAt: "4 hours ago",
    readTime: "2 min read"
  },
  {
    id: 3,
    title: "India Makes Historic Lunar Landing with Chandrayaan-3",
    description: "India becomes the fourth nation to land on the Moon, with ISRO's Chandrayaan-3 touching down on the Moon's south pole.",
    summary: "Historic achievement marks India's entry into elite group of lunar landing nations.",
    tone: "Positive",
    language: "Hindi",
    category: "Space",
    source: "Indian Express",
    publishedAt: "6 hours ago",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities",
    description: "The latest AI model demonstrates unprecedented problem-solving abilities and multi-modal understanding across text, images, and code.",
    summary: "Next-generation AI shows human-level reasoning in complex scenarios.",
    tone: "Positive",
    language: "English",
    category: "AI",
    source: "The Verge",
    publishedAt: "1 hour ago",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Tesla Stock Soars After Record Q3 Deliveries",
    description: "Electric vehicle giant Tesla reported its highest quarterly deliveries, beating analyst expectations and driving stock price up 15%.",
    summary: "Strong delivery numbers boost investor confidence in Tesla's growth trajectory.",
    tone: "Positive",
    language: "English",
    category: "Business",
    source: "Bloomberg",
    publishedAt: "3 hours ago",
    readTime: "3 min read"
  }
];

const NewsFetchLayout = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fetchStage, setFetchStage] = useState("");
  const [newsData, setNewsData] = useState([]);
  
  // WhatsApp scheduling states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [articlesCount, setArticlesCount] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);

  const interests = [
    { id: 'ai', label: 'AI & Technology', icon: '🤖' },
    { id: 'space', label: 'Space & Science', icon: '🚀' },
    { id: 'business', label: 'Business & Finance', icon: '💼' },
    { id: 'health', label: 'Health & Medicine', icon: '🏥' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'politics', label: 'Politics', icon: '🏛️' },
    { id: 'climate', label: 'Climate & Environment', icon: '🌍' }
  ];

  const fetchStages = [
    "Searching news sources...",
    "Analyzing content relevance...",
    "AI processing summaries...",
    "Categorizing articles...",
    "Filtering by quality...",
    "Finalizing results..."
  ];

  useEffect(() => {
    if (!done || !loading) return;

    let currentStage = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (currentStage < fetchStages.length && newProgress > (currentStage + 1) * 16) {
          setFetchStage(fetchStages[currentStage]);
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setLoading(false);
          setFetchStage("News fetch complete!");
          
          // Simulate filtered news based on topic
          const filteredNews = topic.toLowerCase().includes('ai') 
            ? mockNewsData.filter(item => item.category === 'AI')
            : mockNewsData;
          setNewsData(filteredNews);
          
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [done, loading, topic]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic or URL to fetch news");
      return;
    }
    
    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setFetchStage("Initializing news search...");
    setNewsData([]);
  };

  const handleScheduleSetup = () => {
    if (!phoneNumber || !scheduledTime || selectedInterests.length === 0) {
      setScheduleStatus("Please enter phone number, select time, and choose at least one interest");
      return;
    }
    
    // Generate a unique schedule ID
    const newScheduleId = `schedule_${Date.now()}`;
    setScheduleId(newScheduleId);
    setEnableScheduling(true);
    
    const interestLabels = selectedInterests.map(id => 
      interests.find(interest => interest.id === id)?.label
    ).join(', ');
    
    setScheduleStatus(`✓ Daily news scheduled: ${articlesCount} articles about ${interestLabels} at ${scheduledTime} to ${phoneNumber}`);
    
    // In a real implementation, you would set up the Twilio cron job here
    console.log("Setting up Twilio WhatsApp schedule:", {
      scheduleId: newScheduleId,
      phone: phoneNumber,
      time: scheduledTime,
      interests: selectedInterests,
      articlesCount: articlesCount
    });
  };

  const handleScheduleCancel = () => {
    setEnableScheduling(false);
    setScheduleStatus("Schedule cancelled successfully");
    setScheduleId(null);
    
    // In a real implementation, you would cancel the Twilio cron job here
    console.log("Cancelling Twilio WhatsApp schedule:", scheduleId);
    
    // Clear status after 3 seconds
    setTimeout(() => setScheduleStatus(""), 3000);
  };

  const handleInterestToggle = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSendNow = () => {
    if (newsData.length === 0) return;
    
    const articlesToSend = newsData.slice(0, articlesCount);
    console.log("Sending immediate WhatsApp message:", {
      phone: phoneNumber,
      articles: articlesToSend,
      timestamp: new Date().toISOString()
    });
    
    setScheduleStatus(`✓ Sent ${articlesToSend.length} articles to ${phoneNumber} immediately`);
    
    // Clear status after 3 seconds
    setTimeout(() => setScheduleStatus(""), 3000);
  };

  const getToneColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'ai': return <Zap className="w-4 h-4" />;
      case 'space': return <Globe className="w-4 h-4" />;
      case 'legal': return <CheckCircle className="w-4 h-4" />;
      case 'business': return <TrendingUp className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight leading-tight mb-6">
          AI-Powered News Fetcher
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Instantly fetch, analyze, and schedule AI-curated news from trusted sources. Set up automated WhatsApp delivery for daily updates.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Newspaper, text: "AI Curation" },
            { icon: Send, text: "WhatsApp Delivery" },
            { icon: Calendar, text: "Auto Scheduling" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Icon size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">News Search</h2>
                <p className="text-gray-600">Enter topic or URL for AI-powered news fetching</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Topic or Article URL
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., AI technology, climate change, https://news.com/article"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>

              <button
                onClick={SubmitHandler}
                disabled={loading || !topic.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Fetching News...
                  </>
                ) : (
                  <>
                    <Newspaper size={20} />
                    Fetch AI-Curated News
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <CheckCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Scheduling Section */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Send className="text-green-600" size={24} />
              WhatsApp Scheduling
            </h3>
            
            <div className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* Time and Articles Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daily Delivery Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Articles per Day
                  </label>
                  <select
                    value={articlesCount}
                    onChange={(e) => setArticlesCount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={1}>1 Article</option>
                    <option value={3}>3 Articles</option>
                    <option value={5}>5 Articles</option>
                    <option value={10}>10 Articles</option>
                  </select>
                </div>
              </div>

              {/* Interests Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Interests ({selectedInterests.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedInterests.includes(interest.id)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white/70 text-gray-600 hover:border-green-300 hover:bg-green-50/50'
                      }`}
                    >
                      <span>{interest.icon}</span>
                      <span className="text-xs">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!enableScheduling ? (
                  <button
                    onClick={handleScheduleSetup}
                    disabled={!phoneNumber || !scheduledTime || selectedInterests.length === 0}
                    className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Clock size={18} />
                    Setup Daily News Schedule
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleScheduleCancel}
                      className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Cancel Schedule
                    </button>
                    <button
                      onClick={handleSendNow}
                      disabled={newsData.length === 0}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Send size={16} />
                      Send Latest News Now
                    </button>
                  </div>
                )}
              </div>

              {/* Status Display */}
              {scheduleStatus && (
                <div className={`p-4 border rounded-xl ${
                  scheduleStatus.includes('✓') 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  <p className="text-sm font-medium">{scheduleStatus}</p>
                  {enableScheduling && (
                    <div className="mt-2 text-xs text-green-600">
                      <p>• Schedule ID: {scheduleId}</p>
                      <p>• Next delivery: Tomorrow at {scheduledTime}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule Summary */}
              {enableScheduling && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    Active Schedule
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📱 Phone: {phoneNumber}</p>
                    <p>⏰ Time: {scheduledTime} daily</p>
                    <p>📰 Articles: {articlesCount} per day</p>
                    <p>🎯 Interests: {selectedInterests.map(id => 
                      interests.find(interest => interest.id === id)?.icon
                    ).join(' ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {done && loading && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Fetching News</span>
                <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 italic flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                {fetchStage}
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {done && !loading && newsData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest News Results</h2>
              <p className="text-gray-600">AI-curated articles matching your search</p>
            </div>

            <div className="grid gap-6">
              {newsData.map((article) => (
                <div key={article.id} className="bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-600">
                          {getCategoryIcon(article.category)}
                          {article.category}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{article.source}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{article.publishedAt}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{article.readTime}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed">{article.description}</p>

                      {/* AI Summary */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={14} className="text-blue-600" />
                          <span className="text-xs font-semibold text-blue-800">AI Summary</span>
                        </div>
                        <p className="text-sm text-blue-700">{article.summary}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getToneColor(article.tone)}`}>
                          {article.tone}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {article.language}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Delivery Status */}
            {enableScheduling && (
              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <Send className="text-green-600" size={20} />
                  WhatsApp Delivery Active
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-green-700">
                    📱 Delivering {articlesCount} articles daily to <strong>{phoneNumber}</strong> at <strong>{scheduledTime}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-green-600 font-medium">Interests:</span>
                    {selectedInterests.map(id => {
                      const interest = interests.find(i => i.id === id);
                      return (
                        <span key={id} className="px-2 py-1 bg-white/70 border border-green-200 rounded-md text-xs font-medium text-green-700">
                          {interest?.icon} {interest?.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={handleSendNow}
                      disabled={newsData.length === 0}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send Now ({Math.min(articlesCount, newsData.length)} articles)
                    </button>
                    <button 
                      onClick={handleScheduleCancel}
                      className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Cancel Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500 mb-2">
                News articles are AI-curated and analyzed. WhatsApp delivery powered by Twilio API for reliable daily updates.
              </p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} />
                  Secure Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Timezone Support
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  AI Filtering
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {done && !loading && newsData.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No News Found</h3>
            <p className="text-gray-600">Try a different topic or check your URL format</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFetchLayout;