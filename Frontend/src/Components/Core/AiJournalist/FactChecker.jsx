import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, Shield, Search, ExternalLink } from "lucide-react";
import Button from "../../Resusable/Button";

const FactChecker = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [factData, setFactData] = useState(null);

  const analysisStages = [
    "Parsing content...",
    "Searching trusted sources...",
    "Cross-referencing claims...",
    "Analyzing credibility...",
    "Generating fact score...",
    "Finalizing report..."
  ];

  const mockSources = [
    { title: "Reuters - Technology News", url: "reuters.com", verified: "2024-07-21", credibility: 95 },
    { title: "Associated Press - Science", url: "apnews.com", verified: "2024-07-21", credibility: 98 },
    { title: "BBC News - Health", url: "bbc.com", verified: "2024-07-21", credibility: 92 },
    { title: "Nature Journal", url: "nature.com", verified: "2024-07-21", credibility: 99 },
    { title: "Scientific American", url: "scientificamerican.com", verified: "2024-07-21", credibility: 94 },
    { title: "PolitiFact", url: "politifact.com", verified: "2024-07-21", credibility: 89 }
  ];

  useEffect(() => {
    if (!done || !loading) return;

    let currentStage = 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (currentStage < analysisStages.length && newProgress > (currentStage + 1) * 16) {
          setAnalysisStage(analysisStages[currentStage]);
          currentStage++;
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setLoading(false);
          setAnalysisStage("Fact-check complete!");
          
          // Generate mock fact data
          const truthScore = Math.floor(Math.random() * 40) + 60; // 60-100%
          setFactData({
            overallScore: truthScore,
            verdict: truthScore > 85 ? "TRUE" : truthScore > 65 ? "MOSTLY TRUE" : "MIXED",
            categories: {
              factual: Math.floor(Math.random() * 30) + 70,
              sourced: Math.floor(Math.random() * 40) + 60,
              consistent: Math.floor(Math.random() * 35) + 65
            },
            keyClaims: ["AI technology advancement", "market impact assessment", "employment effects", "regulatory framework"],
            confidence: Math.floor(Math.random() * 20) + 80,
            sources: mockSources.slice(0, Math.floor(Math.random() * 3) + 3)
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [done, loading]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter some content or URL to fact-check");
      return;
    }
    
    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setAnalysisStage("Initializing fact-check...");
    setFactData(null);
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case "TRUE":
        return { level: "TRUE", color: "green", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle };
      case "MOSTLY TRUE":
        return { level: "MOSTLY TRUE", color: "blue", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle };
      case "MIXED":
        return { level: "MIXED", color: "yellow", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertTriangle };
      default:
        return { level: "FALSE", color: "red", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle };
    }
  };

  const verdictStyle = factData ? getVerdictStyle(factData.verdict) : null;

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 tracking-tight leading-tight mb-6">
          AI-Powered Fact Checker
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Validate claims and articles against trusted sources using advanced AI cross-referencing and real-time fact verification.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Shield, text: "Source Verification" },
            { icon: Search, text: "Real-time Analysis" },
            { icon: TrendingUp, text: "Credibility Scoring" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Icon size={16} className="text-green-600" />
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Fact Verification</h2>
                <p className="text-gray-600">Enter claims, articles, or URLs for fact-checking</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Content, Topic, or News URL
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Paste your article content, URL, or specific claim here. For example: 'https://news.com/article' or 'AI will replace 40% of jobs by 2030...'"
                  rows={8}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200 hover:border-gray-300"
                  required
                />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{topic.length} characters</span>
                  <span>URLs and specific claims work best</span>
                </div>
              </div>

              <Button
                content={loading ? "Fact-Checking..." : "Verify Facts"}
                condition={!loading && topic.length > 10}
                data={true}
                loading={loading}
                click={SubmitHandler}
                fullWidth={true}
                icon={loading ? undefined : Shield}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Preview */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Search className="text-green-600" size={24} />
              Verification Overview
            </h3>
            
            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit content to see fact-check results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                    <span className="text-sm font-bold text-green-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">{analysisStage}</p>
                </div>

                {/* Real-time stats */}
                {factData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">{factData.overallScore}%</div>
                      <div className="text-xs text-gray-500">Truth Score</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">{factData.confidence}%</div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {done && !loading && factData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Fact Check Report</h2>
              <p className="text-gray-600">Comprehensive verification of your content</p>
            </div>

            {/* Overall Verdict */}
            <div className={`${verdictStyle.bg} ${verdictStyle.border} border-2 rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <verdictStyle.icon className={`text-${verdictStyle.color}-600`} size={24} />
                  Fact Check Verdict
                </h3>
                <span className={`px-4 py-2 bg-${verdictStyle.color}-100 text-${verdictStyle.color}-800 font-bold rounded-full text-sm`}>
                  {verdictStyle.level}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    The content is assessed as <strong>{factData.verdict.toLowerCase()}</strong> with a truth score of <strong>{factData.overallScore}%</strong>. 
                    Our analysis cross-referenced multiple trusted sources with {factData.confidence}% confidence.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Key Claims Verified:</div>
                    <div className="flex flex-wrap gap-2">
                      {factData.keyClaims.map((claim, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs">
                          {claim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
              </div>
            </div>

            {/* Sources Table */}
            <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-white/70 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ExternalLink className="text-blue-600" size={20} />
                  Verified Sources ({factData.sources.length})
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-white/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Source</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Domain</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Credibility</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {factData.sources.map((source, index) => (
                      <tr key={index} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{source.title}</td>
                        <td className="px-6 py-3 text-blue-600 font-mono text-xs">{source.url}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              source.credibility > 90 ? 'bg-green-500' : 
                              source.credibility > 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-semibold">{source.credibility}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-xs">{source.verified}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                Verification Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Always verify breaking news with multiple independent sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Check publication dates and look for recent updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Cross-reference statistical claims with official data sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Be cautious of emotionally charged language and sensational headlines
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This fact-check is powered by AI analysis of trusted sources. Always use critical thinking and verify important claims through official channels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactChecker;