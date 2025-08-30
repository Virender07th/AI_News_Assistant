import React, { useState } from 'react';
import Button from '../../Resusable/Button';
import { languageNames } from '../../../Data/newAchorData';

const Translator = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedLanguage) {
      setError("Please select a target language.");
      return;
    }

    setError("");
    setLoading(true);
    setDone(false);

    // Simulate API translation delay
    setTimeout(() => {
      console.log("Submitted:", topic, selectedLanguage);
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-6 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Multilingual News Translator
        </h1>
        <p className="mt-4 text-base md:text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
          Translate any news article or topic into your preferred language using AI-powered language models.
        </p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-10 justify-center items-center bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-6xl mx-auto">
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col gap-6 w-full max-w-2xl bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Enter News Topic or Article Content
            </label>
            <textarea
              name="topic"
              rows="6"
              placeholder="e.g. 'AI will replace all jobs' or paste the article content..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Language Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Translate to Language
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              required
            >
              <option value="">Select target language</option>
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <Button
              content={loading ? "Translating..." : "Translate Now"}
              condition={!loading}
              data={true}
              color={true}
              style="w-full max-w-[220px] px-6 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out"
              type="submit"
            />
          </div>

          {error && (
            <p className="text-center text-red-600 font-medium animate-pulse">
              {error}
            </p>
          )}
        </form>

        {/* Output Section */}
        {done && (
          <div className="w-full max-w-4xl bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Translated Output in {languageNames[selectedLanguage]}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {/* Replace with translated output when available */}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, molestiae. (This is a placeholder translation for mock data.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;
