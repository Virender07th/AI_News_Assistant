import mongoose from "mongoose";
import Comment from "../Models/Comment.js";
import News from "../Models/News.js";

// ✅ Add a comment to a news article
const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newsId } = req.params;
    const { content, parentCommentId = null } = req.body;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ success: false, message: "Invalid newsId" });
    }
    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const newsDoc = await News.findById(newsId);
    if (!newsDoc) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    const comment = await Comment.create({
      userId,
      newsId,
      content,
      parentCommentId,
    });

    res.status(201).json({
      success: true,
      message: "Comment added",
      data: comment,
    });
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ success: false, message: "Server error adding comment" });
  }
};

// ✅ Update a comment
const updateComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ success: true, message: "Comment updated", data: comment });
  } catch (error) {
    console.error("updateComment error:", error);
    res.status(500).json({ success: false, message: "Server error updating comment" });
  }
};

// ✅ Delete a comment (and its replies)
const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    await Comment.deleteMany({ parentCommentId: commentId });

    res.status(200).json({ success: true, message: "Comment and replies deleted" });
  } catch (error) {
    console.error("deleteComment error:", error);
    res.status(500).json({ success: false, message: "Server error deleting comment" });
  }
};

// ✅ Get all top-level comments + replies for a news article
const getCommentsByNewsId = async (req, res) => {
  try {
    const { newsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ success: false, message: "Invalid newsId" });
    }

    const comments = await Comment.find({ newsId, parentCommentId: null })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .lean();

    const replies = await Comment.find({ newsId, parentCommentId: { $ne: null } })
      .populate("userId", "name email")
      .lean();

    const commentMap = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id.toString()] = comment;
    });

    replies.forEach(reply => {
      const parentId = reply.parentCommentId?.toString();
      if (commentMap[parentId]) {
        commentMap[parentId].replies.push(reply);
      }
    });

    res.status(200).json({ success: true, data: Object.values(commentMap) });
  } catch (error) {
    console.error("getCommentsByNewsId error:", error);
    res.status(500).json({ success: false, message: "Server error fetching comments" });
  }
};

// ✅ Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { parentCommentId } = req.params;
    const { content, newsId } = req.body;

    if (!content || !mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ success: false, message: "Missing or invalid fields" });
    }

    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ success: false, message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      userId,
      newsId,
      content,
      parentCommentId,
    });

    res.status(201).json({ success: true, message: "Reply added", data: reply });
  } catch (error) {
    console.error("replyToComment error:", error);
    res.status(500).json({ success: false, message: "Server error replying to comment" });
  }
};

// ✅ Get all comments by user
const getAllCommentsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .populate("newsId", "title publishedAt sourceName")
      .lean();

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error("getAllCommentsByUser error:", error);
    res.status(500).json({ success: false, message: "Server error fetching user's comments" });
  }
};

export {
  addComment,
  updateComment,
  deleteComment,
  getCommentsByNewsId,
  replyToComment,
  getAllCommentsByUser,
};
