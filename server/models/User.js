import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, select: false },
    location: { type: String, trim: true, maxlength: 100, default: "" },
    occupation: { type: String, trim: true, maxlength: 100, default: "" },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
