import { useState } from 'react';
import React from 'react';
import Button from '../../Resusable/Button';
import InputField from '../../Resusable/InputField';

const recentActivity = [
  { title: "AI in Education", date: "Verified on: 2024-07-21" },
  { title: "Notes", date: "Verified on: 2024-07-21" },
  { title: "Student Data", date: "Verified on: 2024-07-21" },
  { title: "Presentation", date: "Verified on: 2024-07-21" },
  { title: "Classroom", date: "Verified on: 2024-07-21" },
  { title: "Research", date: "Verified on: 2024-07-21" },
];

const FactChecker = () => {
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
          AI-Powered Fact Checker
        </h1>
        <p className="mt-4 text-base md:text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
          Validate any topic, claim, or article using AI and trusted public sources. Powered by real-time cross-referencing and content intelligence.
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
            Paste a news URL or topic to check its authenticity:
          </p>

          <InputField
            label="Topic or News URL"
            name="topic"
            placeholder="e.g. 'AI will replace all jobs', https://news.com/article"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fieldStyle="w-full h-[45px] px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            required
          />

          <div className="flex justify-center">
            <Button
              content={loading ? "Checking..." : "Run Fact Check"}
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

        {/* Fact Check Results */}
        {done && (
          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
              Fact Check Result
            </h2>

            {/* Verdict Section */}
            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Verdict</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed">
                Based on our analysis and source cross-validation, the article appears to be **credible**. No significant misinformation or manipulation detected.
              </p>
            </section>

            {/* Reasoning Section */}
            <section className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Reasoning</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed">
                The claim has been confirmed against publicly available sources. Independent reports from verified outlets support the core facts without contradiction. Sentiment and bias remain within neutral or verifiable boundaries.
              </p>
            </section>

            {/* Sources Table */}
            <div className="w-full mt-6 overflow-x-auto border border-gray-200 rounded-lg bg-gray-50 max-h-[420px]">
              <h3 className="text-lg font-semibold text-gray-900 px-4 py-4 border-b">📰 Verified Sources</h3>
              <table className="min-w-[350px] w-full text-xs sm:text-sm text-left text-black">
                <thead className="sticky top-0 bg-gray-50 z-10 font-semibold border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3">Source Title</th>
                    <th className="px-4 py-3">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-100 transition">
                        <td className="px-4 py-3 whitespace-nowrap">{activity.title}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium whitespace-nowrap">{activity.url}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-gray-500">
                        No sources found for this query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              *Note: This is mock output. API-based validation will fetch real-time data from reliable fact-checking engines and news APIs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactChecker;
