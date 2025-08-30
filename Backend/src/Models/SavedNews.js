import mongoose from "mongoose";


const savedNewsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"News",
    required: true
  },
}, { timestamps: true });

savedNewsSchema.index({ userId: 1, newsId: 1 }, { unique: true }); // no duplicate saves

export default mongoose.model("SavedNews", savedNewsSchema);
