import express from 'express';
import {
  likeNews, 
  unlikeNews, 
  isNewsLiked, 
  getLikedNewsByUserId
} from "../Controllers/LikeController.js" ;
import authMiddleware from '../Middleware/auth.middlewares.js';

const router = express.Router();

router.post("/like", authMiddleware, likeNews);
router.delete("/unlike/:newsId", authMiddleware, unlikeNews);
router.get("/liked/:newsId", authMiddleware, isNewsLiked);
router.get("/likedbyUser", authMiddleware, getLikedNewsByUserId);

export default router;
