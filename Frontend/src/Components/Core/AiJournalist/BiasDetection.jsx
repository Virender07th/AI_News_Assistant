import React, { useState, useEffect } from "react";
import Button from "../../Resusable/Button";

const BiasDetection = () => {
  const [topic, setTopic] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!done) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) {
          clearInterval(timer);
          return 50;
        }
        return prev + 1;
      });
    }, 30); // Faster progress animation

    return () => clearInterval(timer);
  }, [done]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    setLoading(true);
    setDone(true);
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-5 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          AI-Powered Bias Detection
        </h1>
        <p className="mt-4 text-base md:text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
          Analyze the political or emotional bias in any news article or topic using intelligent AI signal detection and sentiment profiling.
        </p>
      </div>

      {/* Main Section */}
      <div className="flex flex-col gap-10 justify-center items-center bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-6xl mx-auto transition-all duration-300">
        {/* Input Form */}
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col gap-6 w-full max-w-2xl border border-gray-100 bg-white rounded-xl p-6 shadow-sm"
        >
          <p className="text-lg text-gray-800 font-medium">
            Enter an article or topic below to begin bias detection:
          </p>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic or News Content
            </label>
            <textarea
              name="message"
              rows="6"
              placeholder="e.g. 'AI will replace all jobs', or paste article URL/content..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-center">
            <Button
              content={loading ? "Analyzing..." : "Detect Bias"}
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

        {/* Results */}
        {done && (
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Bias Detection Report
            </h2>

            {/* Progress Bar */}
            <div className="flex flex-col w-full gap-2">
              <p className="text-base font-medium text-gray-800">Bias Score Analysis</p>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{progress}% completed</p>
            </div>

            {/* Insights */}
            <section className="bg-blue-50 p-5 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-1">🧠 Article Insights</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Our AI analyzed the content's tone, word choice, and framing. Based on this, the article has a <strong>moderate bias</strong> toward a specific viewpoint, but does not exhibit harmful or manipulative content.
              </p>
            </section>

            {/* Reasoning */}
            <section className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-1">📊 AI Reasoning</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The narrative uses emotionally charged words and frames issues in a polarized manner. However, it references factual events. Detected bias level: <span className="font-medium text-yellow-800">Moderate</span>.
              </p>
            </section>

            {/* Verdict */}
            <section className="bg-green-50 p-5 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-1">✅ Final Verdict</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The article shows signs of subjective bias but remains within acceptable editorial standards. It may be suitable for critical reading but should be cross-checked with neutral sources.
              </p>
            </section>

            <p className="text-xs text-gray-500 mt-4">
              *Note: This is a simulated output. For real-time analysis, connect to bias detection APIs or sentiment analysis engines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiasDetection;
