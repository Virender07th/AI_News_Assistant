import express from "express";
import {
  getEverythingNews,
  getTopHeadlines,
  getGoogleNews,
} from "../Controllers/NewsController.js";

const router = express.Router();
router.get("/top-headlines" , getTopHeadlines)
router.get("/everything" , getEverythingNews)
router.get("/google-news", getGoogleNews);

export default router;
