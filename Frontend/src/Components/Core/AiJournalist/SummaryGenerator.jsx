import React, { useState } from "react";
import Button from "../../Resusable/Button";
import InputField from "../../Resusable/InputField";
import {
  bulletPointSummarizer,
  highlightSummarizer,
  paragraphSummarizer,
} from "../../../Services/Operations/AiOperation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";


const SummaryGenerator = () => {
  const [formData, setFormData] = useState({
    url: "",
    topic: "",
  });
  const [outputType, setOutputType] = useState("bulletPoint");
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const SubmitHandler = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    toast.loading("Generating summary...");
    const payload = {
      topic: formData.topic.trim(),
      url: formData.url.trim(),
    };

    let response;
    if (outputType === "paragraph") {
      response = await dispatch(paragraphSummarizer(payload , token));
      if (response?.paragraph) {
        setSummaryText(response.paragraph);
        toast.success("Summary generated successfully.");
      } else {
        throw new Error("Invalid paragraph summary response.");
      }
    } else if (outputType === "keyHighlight") {
      response = await highlightSummarizer(payload , token);
      if (response?.highlights?.length) {
        setSummaryText(response.highlights.join("\n"));
        toast.success("Highlights generated successfully.");
      } else {
        throw new Error("Invalid highlights response.");
      }
    } else {
      response = await bulletPointSummarizer(payload , token);
      if (response?.bullets?.length) {
        setSummaryText(response.bullets.join("\n"));
        toast.success("Bullet points generated successfully.");
      } else {
        throw new Error("Invalid bullets response.");
      }
    }
  } catch (err) {
    console.error("Summarization error:", err);
    toast.error("Error generating summary. Check console.");
    setSummaryText("📌 No summary generated.");
  } finally {
    toast.dismiss();
    setLoading(false);
  }
};

  const renderOutput = () => {
    if (!summaryText) {
      return (
        <p className="text-gray-400 italic text-center">
          Summary will appear here after generation.
        </p>
      );
    }

    if (outputType === "paragraph") {
      return (
        <p className="text-base text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
          {summaryText}
        </p>
      );
    }

    const bullets = summaryText.split("\n").filter((b) => b.trim() !== "");
    return (
      <ul className="list-disc pl-6 space-y-2 text-left text-base text-gray-800">
        {bullets.map((point, i) => (
          <li key={i}>📌 {point}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col w-full h-full px-4 md:px-10 py-6 gap-6 bg-gray-50">
      <div className="w-full px-6 py-4 text-center rounded-xl">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">
          AI Summary Generator
        </h1>
        <p className="mt-2 text-sm md:text-base text-blue-600 max-w-2xl mx-auto">
          Enter an article URL or paste content to generate a clear and concise
          AI-powered summary.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <form
          onSubmit={SubmitHandler}
          className="flex flex-col gap-2 bg-white shadow-lg rounded-xl p-6 lg:p-8 border border-gray-200"
        >
          <InputField
            label="Article URL"
            name="url"
            placeholder="https://example.com/article"
            value={formData.url}
            onChange={handleChange}
            fieldStyle="w-full h-[45px] px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <div className="text-center text-gray-500 font-medium">— or —</div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paste Article
            </label>
            <textarea
              name="topic"
              rows={6}
              placeholder="Paste your article content here..."
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-center pt-2">
            <Button
              content={loading ? "Generating..." : "Generate Summary"}
              condition={true}
              data={true}
              color={true}
              type="submit"
              style={`max-w-[220px] px-8 py-2 text-white font-semibold ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            />
          </div>
        </form>

        {/* Right: Output */}
        <div className="space-y-3">
          <p className="text-lg font-bold text-gray-800">Summary Output Format</p>

          {/* Format Buttons */}
          <div className="flex flex-wrap gap-3">
            {["bulletPoint", "paragraph", "keyHighlight"].map((type) => (
              <button
                key={type}
                type="button"
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 shadow-sm border ${
                  outputType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setOutputType(type)}
              >
                {type === "bulletPoint"
                  ? "Bullet Points"
                  : type === "paragraph"
                  ? "Paragraph"
                  : "Key Highlights"}
              </button>
            ))}
          </div>

          {/* Output Box */}
          <div className="w-full border border-gray-300 rounded-xl p-6 bg-white shadow-inner h-[385px] overflow-y-auto scrollbar text-gray-700 text-sm text-left">
            {renderOutput()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;
