import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: ''
  },
   contactNumber: {
    type: String,
    match: [/^[0-9]{10}$/, "Invalid contact number"],
  },
  imageUrl: {
    type: String,
    default: ''
  },
  location: String,
  interests: {
    type: [String],
    default: []
  },
  gender:{
    type:String,
    enum:["Male" , "Female" ,"Other Gender"],
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', userProfileSchema);