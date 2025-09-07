import "./Utils/dotenv.js"
import express from "express";
import connectDataBase from "./Config/database.js";
import cloudinaryConnect from "./Config/cloudinary.js";
import { initSchedules } from "./Controllers/TwillioController.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport"; 
import bodyParser from "body-parser";

const app = express();

// DataBase
connectDataBase();
// Cloudinary
cloudinaryConnect();


initSchedules();
//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// --- CORS CONFIG ---
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://ai-news-assistant-1-laib.onrender.com" // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / curl

      // allow if origin matches one of allowedOrigins (ignores trailing slash / subpaths)
      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

// handle preflight (important for credentials:true)
app.options("*", cors());

// passport init
app.use(passport.initialize());



//routes
import userRoutes from "./Routes/AuthRoutes.js"
import profileRoutes from "./Routes/ProfileRoutes.js"
import dashboardRoute from "./Routes/DashboardRoutes.js"
import newsRoutes from "./Routes/NewsRoutes.js"
// import likeRoutes from "./Routes/LikeRoutes.js"
// import commentRoutes from "./Routes/CommentRoutes.js"
import savedRoutes from "./Routes/SavedRoutes.js"
import aiFeatures from "./Routes/AIRoutes.js"
import twilioRoutes from "./Routes/TwilioRoutes.js"


app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/dashboard' , dashboardRoute)
app.use('/api/v1/news', newsRoutes);
// app.use('/api/v1/likes', likeRoutes);
// app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/saved', savedRoutes);
app.use("/api/v1/ai" , aiFeatures )
app.use("/api/v1/whatsapp" , twilioRoutes )

//def route
app.get("/", (req, res) => {
    return res.json({
        success:true,
		message:'Your server is up and running....'
	});
});

// Ports 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 App is running at http://localhost:${PORT}`);}
)







