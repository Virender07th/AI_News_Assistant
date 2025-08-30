import React, { useState } from "react";
import NewsCard from "../../Resusable/NewsCard";
import InputField from "../../Resusable/InputField";
import Button from "../../Resusable/Button";
import NewsImage from "../../../assets/NewsImage.png";

// Mock news data
const mockNewsData = [
  {
    title: "Neuralink Begins Human Trials with Brain Chip Implant",
    description:
      "Elon Musk’s Neuralink has initiated human trials of its brain-chip technology, enabling basic computer interaction using neural signals.",
    image: NewsImage,
    tone: "Positive",
    language: "English",
    category: "AI",
  },
  {
    title: "Meta Sued Over Unauthorized Use of AI Training Data",
    description:
      "Meta faces legal action for allegedly training its LLaMA models on copyrighted content without obtaining user consent.",
    image: NewsImage,
    tone: "Negative",
    language: "English",
    category: "Legal",
  },
  {
    title: "India Makes Historic Lunar Landing with Chandrayaan-3",
    description:
      "India becomes the fourth nation to land on the Moon, with ISRO’s Chandrayaan-3 touching down on the Moon’s south pole.",
    image: NewsImage,
    tone: "Positive",
    language: "Hindi",
    category: "Space",
  },
  {
    title: "Google Unveils Gemini-Powered AI Features Across Products",
    description:
      "At Google I/O, the tech giant announced AI enhancements to Gmail, Android, and other platforms, powered by its Gemini models.",
    image: NewsImage,
    tone: "Neutral",
    language: "English",
    category: "AI",
  },
];

const NewsFetchLayout = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    setDone(true);
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-12 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Real-Time AI News Fetcher
        </h1>
        <p className="mt-4 text-base md:text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
          Instantly fetch, analyze, and summarize the latest news from trusted sources using AI. Enter a topic or article URL to get started.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col gap-10 justify-center items-center bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-6xl mx-auto transition-all duration-300">
        {/* Input Form */}
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col gap-6 w-full max-w-2xl border border-gray-100 bg-white rounded-xl p-6 shadow-sm"
        >
          <InputField
            label="Enter Topic or Article URL"
            name="topic"
            placeholder="e.g. AI, Climate Change, https://news.com/article"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fieldStyle="w-full h-[45px] px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            required
          />

          <div className="flex justify-center">
            <Button
              content={loading ? "Fetching..." : "Get AI-Powered News"}
              condition={!loading}
              data={true}
              color={true}
              style="w-full max-w-[220px] px-6 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out"
              type="submit"
            />
          </div>

          {error && (
            <p className="text-center text-red-600 font-medium animate-pulse">{error}</p>
          )}
        </form>

        {/* News Results */}
        {done && (
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <p className="text-xl font-semibold text-gray-800 border-b pb-2">
              Latest News Articles Results
            </p>

            <div className="flex flex-col gap-6">
              {mockNewsData.length > 0 ? (
                mockNewsData.map((item, index) => (
                  <NewsCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    btns={false}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No matching news articles found. Try another topic or URL.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFetchLayout;
