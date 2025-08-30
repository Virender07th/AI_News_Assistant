import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  newsId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  sourceName: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  author: String,
  description: String,
  url: { type: String, required: true },
  urlToImage: String,
  content: String,
  category: String,
});

export default mongoose.model("News", NewsSchema);
