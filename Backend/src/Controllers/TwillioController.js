// controllers/WhatsAppScheduleController.js
import pkg from "twilio";
const { Twilio } = pkg;
import nodeCron from "node-cron";
import axios from "axios";
import { whatsappMessageBody } from "../Utils/Template.js";
import { v4 as uuidv4 } from "uuid";
import WhatsAppSchedule from "../Models/WhatsAppSchedule.js";
import { AiEndpoints } from "../Utils/api.js";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let schedules = {}; // in-memory cron jobs

// 🔹 Normalize API response
const normalizeArticles = (data) => {
  if (!data?.articles || !Array.isArray(data.articles)) return [];

  return data.articles.map((a, idx) => ({
    id: a.id || idx + 1,
    heading: a.heading || a.title || "No heading",
    title: a.title || "Untitled",
    description: a.description || "",
    image:
      a.image ||
      `https://picsum.photos/600/400?random=${Math.floor(
        Math.random() * 1000
      )}`,
    tone: a.tone || "Neutral",
    category: a.category || "General",
    publisher: a.publisher || a.source || "Unknown",
    source: a.source || "Unknown",
    publishedAt: a.publishedAt || new Date().toISOString(),
    url: a.url || "",
  }));
};

// 🔹 Direct fetch for internal use (WhatsApp, cron jobs)
const fetchNewsArticlesDirect = async (payload) => {
  try {
    // Expected payload: { topic, url, interests, num_articles }
    const response = await axios.post(AiEndpoints.FETCH_NEWS_API, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return normalizeArticles(response.data);
  } catch (error) {
    console.error("❌ fetchNewsArticlesDirect error:", error.message);
    return [];
  }
};

// --- Helper: Send WhatsApp message ---
// --- Helper: Send WhatsApp message ---
const sendWhatsAppMessage = async (phone, payload) => {
  try {
    const articles = await fetchNewsArticlesDirect(payload);

    if (!articles?.length) return console.log("⚠️ No articles to send");

    const selectedArticles = articles.slice(0, payload.num_articles || 3);
    const body = whatsappMessageBody(selectedArticles);

    // const body = "hello from harsh"

    console.log("📨 Sending WhatsApp message...");
    console.log("From:", process.env.TWILIO_WHATSAPP_NUMBER);
    console.log("To:", `whatsapp:${phone}`);
    console.log("Body:", body);

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body,
    });

    console.log(`✅ Sent WhatsApp message to ${phone}`);
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error.message);
    if (error.code) console.error("Twilio error code:", error.code);
  }
};


// --- Create or Update Schedule ---
// --- Create or Update Schedule ---
const scheduleMessage = async (req, res) => {
  try {
    const { phoneNumber, scheduledTime, payload } = req.body;
    const userId = req.user._id;

    if (!phoneNumber || !scheduledTime || !payload) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Generate or reuse scheduleId
    let existing = await WhatsAppSchedule.findOne({ phoneNumber });
    const scheduleId = existing ? existing.scheduleId : uuidv4();

    const [hour, minute] = scheduledTime.split(":").map(Number);

    // Stop existing task if already created
    if (schedules[scheduleId]?.task) schedules[scheduleId].task.stop();

    // Create new cron job
    const task = nodeCron.schedule(
      `${minute} ${hour} * * *`,
      () => sendWhatsAppMessage(phoneNumber, payload),
      { scheduled: true, timezone: "Asia/Kolkata" }
    );

    schedules[scheduleId] = { task, phoneNumber, scheduledTime, payload };

    // ✅ Upsert by phoneNumber (avoid duplicate key error)
    await WhatsAppSchedule.findOneAndUpdate(
      { phoneNumber },
      { userId, scheduleId, phoneNumber, scheduledTime, payload, isActive: true },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: existing
        ? "WhatsApp schedule updated"
        : "WhatsApp schedule created",
      scheduleId,
    });
  } catch (error) {
    console.error("❌ scheduleMessage error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// --- Cancel Schedule ---
const cancelSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (schedules[scheduleId]?.task) {
      schedules[scheduleId].task.stop();
      delete schedules[scheduleId];
    }

    await WhatsAppSchedule.findOneAndUpdate(
      { scheduleId },
      { isActive: false }
    );

    return res.json({ success: true, message: "Schedule cancelled" });
  } catch (error) {
    console.error("❌ cancelSchedule error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Send Immediately ---
const sendNow = async (req, res) => {
  try {
    const { phoneNumber, payload } = req.body;
    if (!phoneNumber || !payload)
      return res.status(400).json({ error: "Missing required fields" });

    await sendWhatsAppMessage(phoneNumber, payload);
    
    res.json({ success: true, message: "WhatsApp sent immediately" });
  } catch (error) {
    console.error("❌ sendNow error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Load saved schedules on server start ---
const initSchedules = async () => {
  try {
    const activeSchedules = await WhatsAppSchedule.find({ isActive: true });

    activeSchedules.forEach((schedule) => {
      const [hour, minute] = schedule.scheduledTime.split(":").map(Number);

      const task = nodeCron.schedule(
        `${minute} ${hour} * * *`,
        () => sendWhatsAppMessage(schedule.phoneNumber, schedule.payload),
        { scheduled: true, timezone: "Asia/Kolkata" }
      );

      schedules[schedule.scheduleId] = {
        task,
        phoneNumber: schedule.phoneNumber,
        scheduledTime: schedule.scheduledTime,
        payload: schedule.payload,
      };

      console.log(`🔄 Restored schedule for ${schedule.phoneNumber}`);
    });
  } catch (error) {
    console.error("❌ initSchedules error:", error.message);
  }
};

export { scheduleMessage, cancelSchedule, sendNow, initSchedules };
