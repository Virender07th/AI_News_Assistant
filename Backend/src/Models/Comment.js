import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    newsId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "News", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    parentCommentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment", 
      default: null 
    },
  },
  { timestamps: true } // handles createdAt & updatedAt automatically
);

export default mongoose.model("Comment", CommentSchema);
