import express from "express";
import {
  FetchNewsArticles,
  FactCheck,
  BiasDetection,
  ParagraphSummarizer,
  BulletsSummarizer,
  HighlightSummarizer,
  TranslateArticle,
  GenerateNewsArticle,
} from "../Controllers/AIController.js";

const router = express.Router();

router.post("/fetch-news", FetchNewsArticles);
router.post("/fact-check", FactCheck);
router.post("/bias-detection", BiasDetection);
router.post("/summarizer/para", ParagraphSummarizer);
router.post("/summarizer/bullets", BulletsSummarizer);
router.post("/summarizer/highlight", HighlightSummarizer);
router.post("/translate", TranslateArticle);
router.post("/generate-news", GenerateNewsArticle);

export default router;
