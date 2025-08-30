import axios from "axios";
import { AiEndpoints } from "../Utils/api.js";

const callFastAPI = async (endpoint, data, res) => {
  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json", // ✅ force header
      },
    });
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch from ${endpoint}`,
      error: error?.response?.data || "Internal Server Error",
    });
  }
};


 const FetchNewsArticles = async (req, res) => {
  await callFastAPI(AiEndpoints.FETCH_NEWS_API, req.body, res);
};

 const FactCheck = async (req, res) => {
  await callFastAPI(AiEndpoints.FACT_CHECKER_API, req.body, res);
};

 const BiasDetection = async (req, res) => {
  await callFastAPI(AiEndpoints.BIAS_DETECTION_API, req.body, res);
};

const ParagraphSummarizer = async (req, res) => {
  await callFastAPI(AiEndpoints.PARAGRAPH_SUMMARIZE_API, req.body, res);
};

const BulletsSummarizer = async (req, res) => {
    console.log("✔ pre Bullets summarizer route hit!");
  await callFastAPI(AiEndpoints.BULLETS_SUMMARIZE_API, req.body, res);
  console.log("✔ post Bullets summarizer route hit!");
};

 const HighlightSummarizer = async (req, res) => {
  await callFastAPI(AiEndpoints.HIGHLIGHT_SUMMARIZE_API, req.body, res);
};

const TranslateArticle = async (req, res) => {
  await callFastAPI(AiEndpoints.TRANSLATE_API, req.body, res);
};

const GenerateNewsArticle = async (req, res) => {
  await callFastAPI(AiEndpoints.NEWS_ARTICLE_GENERATE_API, req.body, res);
};


export {
    FetchNewsArticles ,
    FactCheck,
    BiasDetection,
    ParagraphSummarizer ,
    BulletsSummarizer , 
    HighlightSummarizer,
    TranslateArticle,
    GenerateNewsArticle,
}