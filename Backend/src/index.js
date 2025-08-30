import "./Utils/dotenv.js"
import express from "express";
import connectDataBase from "./Config/database.js";
import cloudinaryConnect from "./Config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport"; 
const app = express();

// DataBase
connectDataBase();
// Cloudinary
cloudinaryConnect();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);



//routes
import userRoutes from "./Routes/AuthRoutes.js"
import profileRoutes from "./Routes/ProfileRoutes.js"
import newsRoutes from "./Routes/NewsRoutes.js"
// import likeRoutes from "./Routes/LikeRoutes.js"
// import commentRoutes from "./Routes/CommentRoutes.js"
// import savedRoutes from "./Routes/SavedRoutes.js"
import aiFeatures from "./Routes/AIRoutes.js"


app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/news', newsRoutes);
// app.use('/api/v1/likes', likeRoutes);
// app.use('/api/v1/comments', commentRoutes);
// app.use('/api/v1/saved', savedRoutes);
app.use("/api/v1/ai" , aiFeatures )

//def route
app.get("/", (req, res) => {
    return res.json({
        success:true,
		message:'Your server is up and running....'
	});
});

// Ports 
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})




// ✅ add passport




