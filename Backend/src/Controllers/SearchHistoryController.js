import SearchHistory from "../Models/SearchHistory";

const addSearchQuery = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const existingQuery = await SearchHistory.findOneAndUpdate(
      { userId, query: query.trim() },
      { $set: { updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Search Saved ",
      data: existingQuery,
    });
  } catch (error) {
    console.error("addSearchQuery error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saving search",
    });
  }
};

const getSearchHistoryByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await SearchHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "All search history of user",
      data: history,
    });
  } catch (error) {
    console.error("getSearchHistory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching history",
    });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await SearchHistory.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Search history cleared",
    });
  } catch (error) {
    console.error("Clear Search History error : ", error);
    res.status(500).json({
      success: false,
      message: "Server error clearing history",
    });
  }
};

export { addSearchQuery, getSearchHistoryByUserId, clearSearchHistory };
