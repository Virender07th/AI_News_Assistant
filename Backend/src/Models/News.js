import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  newsId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  urlToImage: String,
  author: String,
  publisher:String,
  category: String,
  url: { 
    type: String, 
    required: true 
  },
  publishedAt: { 
    type: Date, 
  },
});

export default mongoose.model("News", NewsSchema);
