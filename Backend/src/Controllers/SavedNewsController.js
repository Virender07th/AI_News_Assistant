import SavedNews from "../Models/SavedNews.js";
import News from "../Models/News.js";
import generateNewsId from "../Utils/generateNewsID.js";

// Save a news article
const saveNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { author, title, publisher, publishedAt, url, urlToImage, description, category } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: "Missing required news fields" });
    }

    const newsIdStr = generateNewsId(title, url);

    let newsDoc = await News.findOne({ newsId: newsIdStr });
    if (!newsDoc) {
      newsDoc = await News.create({ newsId: newsIdStr, title, description, urlToImage, author, publisher, url, publishedAt, category });
    }else{
       return res.status(200).json({
success: false, message: "News already saved"
      })
    }

    const existingSavedNews = await SavedNews.findOne({ userId, newsId: newsDoc._id });
    if (existingSavedNews) {
      return res.status(409).json({ success: false, message: "News already saved" });
    }

    const newSavedNews = await SavedNews.create({ userId, newsId: newsDoc._id });
    await newSavedNews.populate("newsId");

    res.status(201).json({ success: true, message: "News saved successfully", newsId: newsIdStr, data: newSavedNews });
  } catch (error) {
    console.error("saveNews error:", error);
    res.status(500).json({ success: false, message: "Server error saving news" });
  }
};

// Remove a saved news article
const removeSavedNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newsId } = req.params;

    const newsDoc = await News.findOne({ newsId });
    if (!newsDoc) return res.status(404).json({ success: false, message: "News not found" });

    const deletedNews = await SavedNews.findOneAndDelete({ userId, newsId: newsDoc._id });
    if (!deletedNews) return res.status(404).json({ success: false, message: "Saved news not found" });

    const remainingSavedNews = await SavedNews.find({ userId }).sort({ createdAt: -1 }).populate("newsId");

    res.status(200).json({ success: true, message: "Saved news removed successfully", data: remainingSavedNews });
  } catch (error) {
    console.error("removeSavedNews error:", error);
    res.status(500).json({ success: false, message: "Server error removing saved news" });
  }
};

// Get all saved news for a user
const getSavedNews = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedNews = await SavedNews.find({ userId }).sort({ createdAt: -1 }).populate("newsId");
    res.status(200).json({ success: true, data: savedNews });
  } catch (error) {
    console.error("getSavedNews error:", error);
    res.status(500).json({ success: false, message: "Server error fetching saved news" });
  }
};

export { saveNews, removeSavedNews, getSavedNews };
