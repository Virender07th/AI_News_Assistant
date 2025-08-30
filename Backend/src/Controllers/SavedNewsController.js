// Controllers/SavedNewsController.js

import SavedNews from "../Models/SavedNews";
import News from "../Models/News";
import generateNewsId from "../Utils/generateNewsID";

// Save a news article
const saveNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { author, title, source, publishedAt, url, content, urlToImage, description, category } = req.body;

    const sourceName = source?.name;
    if (!title || !sourceName || !publishedAt || !url) {
      return res.status(400).json({
        success: false,
        message: "Missing required news fields",
      });
    }

    const newsIdStr = generateNewsId(title, sourceName, publishedAt);

    // Check if news already exists in the News collection
    let newsDoc = await News.findOne({ newsId: newsIdStr });
    if (!newsDoc) {
      newsDoc = await News.create({
        newsId: newsIdStr,
        sourceName,
        author,
        title,
        description,
        url,
        urlToImage,
        publishedAt,
        content,
        category,
      });
    }

    // Check if the news is already saved by the user
    const existingSavedNews = await SavedNews.findOne({ userId, newsId: newsDoc._id });
    if (existingSavedNews) {
      return res.status(409).json({
        success: false,
        message: "News already saved",
      });
    }

    // Save the news
    const newSavedNews = await SavedNews.create({ userId, newsId: newsDoc._id });

    res.status(201).json({
      success: true,
      message: "News saved successfully",
      data: newSavedNews,
    });
  } catch (error) {
    console.error("saveNews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saving news",
    });
  }
};

// Remove a saved news article
const removeSavedNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newsIdStr } = req.params;

    const newsDoc = await News.findOne({ newsId: newsIdStr });
    if (!newsDoc) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const deletedNews = await SavedNews.findOneAndDelete({ userId, newsId: newsDoc._id });
    if (!deletedNews) {
      return res.status(404).json({
        success: false,
        message: "Saved news not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Saved news removed successfully",
    });
  } catch (error) {
    console.error("removeSavedNews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error removing saved news",
    });
  }
};

// Get all saved news for a user
const getSavedNews = async (req, res) => {
  try {
    const userId = req.user._id;

    const savedNews = await SavedNews.find({ userId })
      .sort({ createdAt: -1 })
      .populate("newsId"); // Populate news details

    res.status(200).json({
      success: true,
      data: savedNews,
    });
  } catch (error) {
    console.error("getSavedNews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching saved news",
    });
  }
};

export {
  saveNews,
  removeSavedNews,
  getSavedNews,
};
