import axios from "axios";
import { AiEndpoints } from "../Utils/api.js";
import Activity from "../Models/Activity.js";
import UserStats from "../Models/UserStats.js";

//
// --- Helper: Record Activity + Update Stats ---
//
const recordActivityHelper = async ({ userId, title, type, status }) => {
  try {
    // Create activity log
    const activity = await Activity.create({ userId, title, type, status });

    // Find or create stats
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = new UserStats({ userId });
    }

    // Update counters based on type
    if (type === "summary") stats.summary += 1;
    if (type === "factcheck") stats.factCheck += 1;
    if (type === "biasDetection") stats.biasDetection += 1;
    if (type === "video") stats.video += 1;
    if (type === "translate") stats.translate += 1;
    if (type === "fetchNews") stats.fetchNews += 1;

    await stats.save();

    return { activity, stats };
  } catch (error) {
    console.error("Error recording activity:", error);
    return null; // don’t crash the API if logging fails
  }
};

//
// --- Generic FastAPI Call Handler ---
//
const callFastAPI = async (endpoint, data, res, meta = null) => {
  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apiData = response.data;

    if (apiData.success) {
      // Record activity if meta info is provided
      if (meta) {
        await recordActivityHelper({
          userId: meta.userId,
          title: meta.title,
          type: meta.type,
          status: "completed",
        });
      }

      return res.status(200).json({
        success: true,
        data: apiData,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "API returned success=false",
      });
    }
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch from ${endpoint}`,
      error: error?.response?.data || "Internal Server Error",
    });
  }
};

//
// --- Routes ---
//
const FetchNewsArticles = async (req, res) => {
  await callFastAPI(AiEndpoints.FETCH_NEWS_API, req.body, res, {
    userId: req.user.id,
    type: "fetchNews",
    title: req.body.topic || "Fetch News Article",
  });
};

const FactCheck = async (req, res) => {
  await callFastAPI(AiEndpoints.FACT_CHECKER_API, req.body, res, {
    userId: req.user.id,
    type: "factcheck",
    title: req.body.topic || "Fact Check",
  });
};

const BiasDetection = async (req, res) => {
  await callFastAPI(AiEndpoints.BIAS_DETECTION_API, req.body, res, {
    userId: req.user.id,
    type: "biasDetection",
    title: req.body.topic || "Bias Detection",
  });
};

const ParagraphSummarizer = async (req, res) => {
  await callFastAPI(AiEndpoints.PARAGRAPH_SUMMARIZE_API, req.body, res, {
    userId: req.user.id,
    type: "summary",
    title: req.body.topic || "Paragraph Summary News Article",
  });
};

const BulletsSummarizer = async (req, res) => {
  console.log("✔ Pre Bullets summarizer route hit!");
  await callFastAPI(AiEndpoints.BULLETS_SUMMARIZE_API, req.body, res, {
    userId: req.user.id,
    type: "summary",
    title: req.body.topic || "Bullets Point Summary News Article",
  });
  console.log("✔ Post Bullets summarizer route hit!");
};

const HighlightSummarizer = async (req, res) => {
  await callFastAPI(AiEndpoints.HIGHLIGHT_SUMMARIZE_API, req.body, res, {
    userId: req.user.id,
    type: "summary",
    title: req.body.topic || "Highlight Summary News Article",
  });
};

const TranslateArticle = async (req, res) => {
  await callFastAPI(AiEndpoints.TRANSLATE_API, req.body, res, {
    userId: req.user.id,
    type: "translate",
    title: req.body.topic || "Translate News Article",
  });
};

const GenerateNewsArticle = async (req, res) => {
  // This one doesn’t log activity
  await callFastAPI(AiEndpoints.NEWS_ARTICLE_GENERATE_API, req.body, res);
};

export {
  recordActivityHelper,
  FetchNewsArticles,
  FactCheck,
  BiasDetection,
  ParagraphSummarizer,
  BulletsSummarizer,
  HighlightSummarizer,
  TranslateArticle,
  GenerateNewsArticle,
};
