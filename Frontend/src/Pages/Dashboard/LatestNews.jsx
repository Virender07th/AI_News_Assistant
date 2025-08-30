

// LatestNews.jsx - Enhanced version
import React from 'react';
import NewsCard from '../../Components/Resusable/NewsCard';
import NewsImage from '../../assets/bg2.jpg';
import { TrendingUp, Sparkles } from 'lucide-react';

const newsData = [
  {
    category: "AI",
    heading: "OpenAI Releases GPT-5 With Major Upgrades",
    author: "Sophia Lee",
    publisher: "TechCrunch",
    image: NewsImage,
    description:
      "OpenAI has officially launched GPT-5, its most powerful language model to date, offering significant improvements in reasoning, multilingual support, and safety. The new model demonstrates unprecedented capabilities in complex problem-solving and creative tasks, setting new benchmarks for artificial intelligence performance."
  },
  {
    category: "Space",
    heading: "NASA Discovers Potentially Habitable Exoplanet",
    author: "James Carter",
    publisher: "NASA Newsroom",
    image: NewsImage,
    description:
      "Astronomers at NASA have identified a new Earth-sized exoplanet located in the habitable zone, raising hopes for potential life beyond our solar system. The planet, dubbed Kepler-442c, shows promising signs of having liquid water and a stable atmosphere."
  },
  {
    category: "Cybersecurity",
    heading: "Global Ransomware Attack Hits Over 50 Countries",
    author: "Aisha Khan",
    publisher: "CyberWire",
    image: NewsImage,
    description:
      "A coordinated ransomware attack has affected critical infrastructure in over 50 countries, prompting emergency responses from global cybersecurity agencies. The attack highlights the urgent need for improved international cybersecurity cooperation."
  },
  {
    category: "Healthcare",
    heading: "AI Diagnoses Rare Diseases With 90% Accuracy",
    author: "Dr. Rajiv Sharma",
    publisher: "Medical AI Weekly",
    image: NewsImage,
    description:
      "Researchers have developed an AI system that can accurately diagnose over 200 rare conditions, potentially revolutionizing early detection in medicine. The breakthrough could help millions of patients worldwide receive timely and accurate diagnoses."
  },
  {
    category: "Finance",
    heading: "Bitcoin Surges Past $100K Amid Market Optimism",
    author: "Linda Torres",
    publisher: "Bloomberg",
    image: NewsImage,
    description:
      "Bitcoin has reached a record-breaking $100,000 valuation following bullish investor sentiment and increasing institutional adoption of cryptocurrency. The milestone marks a significant moment in the evolution of digital assets."
  }
];

const LatestNews = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-300" />
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">Latest</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Trending News
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100 leading-relaxed">
              Stay informed with the most important stories, powered by AI journalism and real-time fact-checking
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{newsData.length}</div>
                <div className="text-blue-200">Breaking Stories</div>
              </div>
              <div className="w-px h-8 bg-blue-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">24/7</div>
                <div className="text-blue-200">AI Coverage</div>
              </div>
              <div className="w-px h-8 bg-blue-400/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">100%</div>
                <div className="text-blue-200">Fact-Checked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Today's Top Stories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* News Cards Grid */}
        <div className="space-y-8 lg:space-y-12">
          {newsData.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-500 hover:scale-[1.02]"
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
        </div>

        {/* Load More Section */}
        <div className="text-center mt-16">
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <span>Load More Stories</span>
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
