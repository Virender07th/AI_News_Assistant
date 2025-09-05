import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, Globe, Languages, Zap } from "lucide-react";
import Button from "../../Resusable/Button";

const Translator = () => {
  const [topic, setTopic] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [translationData, setTranslationData] = useState(null);

  // Mock language data - replace with your actual languageNames import
  const languageNames = {
    "es": "Spanish (Español)",
    "fr": "French (Français)",
    "de": "German (Deutsch)",
    "it": "Italian (Italiano)",
    "pt": "Portuguese (Português)",
    "ru": "Russian (Русский)",
    "ja": "Japanese (日本語)",
    "ko": "Korean (한국어)",
    "zh": "Chinese (中文)",
    "ar": "Arabic (العربية)",
    "hi": "Hindi (हिंदी)",
    "tr": "Turkish (Türkçe)",
    "pl": "Polish (Polski)",
    "nl": "Dutch (Nederlands)",
    "sv": "Swedish (Svenska)"
  };

  const analysisStages = [
    "Analyzing source text...",
    "Detecting language patterns...",
    "Processing translation...",
    "Applying context understanding...",
    "Refining accuracy...",
    "Finalizing translation..."
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
          setAnalysisStage("Translation complete!");
          
          // Generate mock translation data
          const mockTranslations = {
            "es": "La inteligencia artificial está transformando rápidamente varias industrias y se espera que tenga un impacto significativo en el mercado laboral global. Los expertos predicen que aproximadamente el 40% de los empleos podrían verse afectados por la automatización en la próxima década.",
            "fr": "L'intelligence artificielle transforme rapidement diverses industries et devrait avoir un impact significatif sur le marché du travail mondial. Les experts prédisent qu'environ 40% des emplois pourraient être affectés par l'automatisation au cours de la prochaine décennie.",
            "de": "Künstliche Intelligenz transformiert schnell verschiedene Branchen und wird voraussichtlich einen erheblichen Einfluss auf den globalen Arbeitsmarkt haben. Experten prognostizieren, dass etwa 40% der Arbeitsplätze im nächsten Jahrzehnt von der Automatisierung betroffen sein könnten.",
            "default": "Artificial intelligence is rapidly transforming various industries and is expected to have a significant impact on the global job market. Experts predict that approximately 40% of jobs could be affected by automation in the next decade."
          };

          const translatedText = mockTranslations[selectedLanguage] || mockTranslations.default;
          
          setTranslationData({
            translatedText,
            originalLength: topic.length,
            translatedLength: translatedText.length,
            detectedLanguage: "English",
            targetLanguage: languageNames[selectedLanguage],
            confidence: Math.floor(Math.random() * 20) + 80,
            processingTime: (Math.random() * 2 + 1).toFixed(1) + "s",
            keyPhrases: ["artificial intelligence", "industries", "job market", "automation", "experts predict"]
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [done, loading, selectedLanguage, topic]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError("Please enter text to translate");
      return;
    }
    
    if (!selectedLanguage) {
      setError("Please select a target language");
      return;
    }
    
    setError("");
    setLoading(true);
    setDone(true);
    setProgress(0);
    setAnalysisStage("Initializing translation...");
    setTranslationData(null);
  };

  const popularLanguages = ["es", "fr", "de", "zh", "ja", "ar"];
  const allLanguages = Object.entries(languageNames);

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-8 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-cyan-50/20">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 tracking-tight leading-tight mb-6">
          AI-Powered Translator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Break language barriers with intelligent translation powered by advanced neural networks and contextual understanding.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            { icon: Globe, text: "100+ Languages" },
            { icon: Zap, text: "Instant Translation" },
            { icon: Languages, text: "Context Aware" }
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Icon size={16} className="text-indigo-600" />
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Text Translation</h2>
                <p className="text-gray-600">Enter content and select target language</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Source Text
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter the text you want to translate here. This can be news articles, documents, or any content you need in another language..."
                    rows={8}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 hover:border-gray-300"
                    required
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{topic.length} characters</span>
                    <span>Auto-detect source language</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Target Language
                  </label>
                  
                  {/* Popular Languages Quick Select */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 font-medium">Popular Languages:</div>
                    <div className="flex flex-wrap gap-2">
                      {popularLanguages.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setSelectedLanguage(code)}
                          className={`px-3 py-2 text-xs rounded-full border-2 transition-all duration-200 ${
                            selectedLanguage === code
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          {languageNames[code].split(' (')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Full Language Dropdown */}
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                    required
                  >
                    <option value="">Select target language...</option>
                    {allLanguages.map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                content={loading ? "Translating..." : "Translate Text"}
                condition={!loading && topic.trim() && selectedLanguage}
                data={true}
                loading={loading}
                click={SubmitHandler}
                fullWidth={true}
                icon={loading ? undefined : Languages}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="text-indigo-600" size={24} />
              Translation Preview
            </h3>
            
            {!done ? (
              <div className="space-y-4 text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Submit text to see translation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Translation Progress</span>
                    <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">{analysisStage}</p>
                </div>

                {/* Real-time stats */}
                {translationData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-indigo-600">{translationData.confidence}%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-cyan-600">{translationData.processingTime}</div>
                      <div className="text-xs text-gray-500">Process Time</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {done && !loading && translationData && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8 space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Translation Results</h2>
              <p className="text-gray-600">AI-powered language translation output</p>
            </div>

            {/* Translation Stats */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-2 border-indigo-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={24} />
                  Translation Summary
                </h3>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 font-bold rounded-full text-sm">
                  {translationData.confidence}% Accurate
                </span>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">
                    {translationData.detectedLanguage}
                  </div>
                  <div className="text-xs text-gray-500">Source Language</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {translationData.targetLanguage?.split(' (')[0]}
                  </div>
                  <div className="text-xs text-gray-500">Target Language</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-600">{translationData.originalLength}</div>
                  <div className="text-xs text-gray-500">Original Chars</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{translationData.processingTime}</div>
                  <div className="text-xs text-gray-500">Process Time</div>
                </div>
              </div>
            </div>

            {/* Translation Output */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original Text */}
              <div className="bg-gray-50/50 border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Original Text ({translationData.detectedLanguage})
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-sm max-h-64 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {topic}
                  </p>
                </div>
              </div>

              {/* Translated Text */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 border-2 border-indigo-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  Translated Text ({translationData.targetLanguage?.split(' (')[0]})
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-sm max-h-64 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {translationData.translatedText}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Phrases */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-cyan-800 mb-3 flex items-center gap-2">
                <TrendingUp className="text-cyan-600" size={20} />
                Key Phrases Translated
              </h3>
              <div className="flex flex-wrap gap-2">
                {translationData.keyPhrases.map((phrase, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white border border-cyan-300 rounded-full text-sm font-medium text-cyan-700"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                Translation Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Review translations for context-specific terms and cultural nuances
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Consider having important documents reviewed by native speakers
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Be aware that idioms and colloquialisms may not translate directly
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                This translation is powered by advanced AI language models. For critical documents, consider professional human review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;