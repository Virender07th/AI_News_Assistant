import express from "express";
import authMiddleware from "../Middleware/auth.middlewares.js";
import {
  scheduleMessage, cancelSchedule, sendNow,
} from "../Controllers/TwillioController.js";

const router = express.Router();

router.post("/schedule", authMiddleware, scheduleMessage);
router.post("/cancel-schedule", authMiddleware, cancelSchedule);
router.post("/send-now", authMiddleware, sendNow);

export default router;
