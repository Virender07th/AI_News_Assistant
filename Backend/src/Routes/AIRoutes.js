import express from "express";
import {
  FetchNewsArticles,
  FactCheck,
  BiasDetection,
  Summarizer,
  TranslateArticle,
  GenerateNewsArticle,
} from "../Controllers/AIController.js";
import auth from "../Middleware/auth.middlewares.js"
const router = express.Router();

router.post("/fetch-news", auth , FetchNewsArticles);
router.post("/fact-check",auth , FactCheck);
router.post("/bias-detection",auth , BiasDetection);
router.post("/summarizer", auth ,Summarizer);
router.post("/translate",auth, TranslateArticle);
router.post("/generate-news",auth , GenerateNewsArticle);

export default router;
