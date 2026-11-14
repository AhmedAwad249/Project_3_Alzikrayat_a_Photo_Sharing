import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  fileName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  likedBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    select: false,
  },
  dateTime: { type: Date, default: Date.now },
});

export default mongoose.model("Photo", photoSchema);
