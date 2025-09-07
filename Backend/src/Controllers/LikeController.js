// // Controllers/newsLikeController.js
// import Like from "../Models/Like.js";
// import News from "../Models/News.js";
// import generateNewsId from "../Utils/generateNewsID.js";

// // Like a news article
// const likeNews = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const {
//       author,
//       title,
//       source,
//       publishedAt,
//       url,
//       content,
//       urlToImage,
//       description,
//       category,
//     } = req.body;

//     const sourceName = source?.name?.trim() || source?.trim();
    
//     if (!title?.trim() || !sourceName || !publishedAt || !url?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: title, source, publishedAt, or url",
//       });
//     }

//     const newsIdStr = generateNewsId(title, publishedAt, url);

//     // Save news if it doesn't exist
//     let news = await News.findOne({ newsId: newsIdStr });
//     if (!news) {
//       news = await News.create({
//         newsId: newsIdStr,
//         title: title.trim(),
//         sourceName,
//         publishedAt,
//         author: author?.trim() || null,
//         description: description?.trim() || null,
//         url: url.trim(),
//         urlToImage: urlToImage || null,
//         content: content || null,
//         category: category || null,
//       });
//     }

//     // Prevent duplicate likes
//     const existingLike = await Like.findOne({ userId, newsId: newsIdStr });
//     if (existingLike) {
//       return res.status(409).json({
//         success: false,
//         message: "Already liked",
//       });
//     }

//     const newLike = await Like.create({
//       userId,
//       newsId: newsIdStr,
//     });

//     res.status(201).json({
//       success: true,
//       message: "News liked",
//       data: newLike,
//     });
//   } catch (error) {
//     console.error("likeNews error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error liking news",
//     });
//   }
// };

// // Unlike a news article
// const unlikeNews = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { newsId } = req.params;

//     const deleted = await Like.findOneAndDelete({ userId, newsId });
//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Like not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "News unliked",
//     });
//   } catch (error) {
//     console.error("unlikeNews error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error unliking news",
//     });
//   }
// };

// // Check if a news article is liked
// const isNewsLiked = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { newsId } = req.params;

//     const existingLike = await Like.findOne({ userId, newsId });

//     res.status(200).json({
//       success: true,
//       liked: !!existingLike,
//     });
//   } catch (error) {
//     console.error("isNewsLiked error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error checking like",
//     });
//   }
// };

// // Get all liked news by a user
// const getLikedNewsByUserId = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const likes = await Like.find({ userId })
//       .sort({ likedAt: -1 })
//       .populate({
//         path: "newsId",
//         model: "News",
//       });

//     res.status(200).json({
//       success: true,
//       data: likes,
//     });
//   } catch (error) {
//     console.error("getLikedNews error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error fetching likes",
//     });
//   }
// };

// export { likeNews, unlikeNews, isNewsLiked, getLikedNewsByUserId };
