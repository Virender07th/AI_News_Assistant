// import express from "express";
// import {
//   addComment,
//   getCommentsByNewsId,
//   updateComment,
//   deleteComment,
//   replyToComment,
//   getAllCommentsByUser,
// } from "../Controllers/CommentController.js";
// import authMiddleware from "../Middleware/auth.middlewares.js";

// const router = express.Router();

// router.post("/:newsId", authMiddleware, addComment);
// router.post("/reply/:parentCommentId", authMiddleware, replyToComment);
// router.put("/:commentId", authMiddleware, updateComment);
// router.delete("/:commentId", authMiddleware, deleteComment);
// router.get("/user", authMiddleware, getAllCommentsByUser);
// router.get("/:newsId", authMiddleware, getCommentsByNewsId);

// export default router;
