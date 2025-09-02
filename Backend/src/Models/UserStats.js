import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: Number, default: 0 },
  summary: { type: Number, default: 0 },
  translate: { type: Number, default: 0 },
  biasDetection: { type: Number, default: 0 },
  factCheck: { type: Number, default: 0 },
  fetchNews: { type: Number, default: 0 },
});

export default mongoose.model("UserStats", statsSchema);
