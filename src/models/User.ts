import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // optional — Google users won't have one
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    provider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    wishlist: {
      type: [String],
      default: [],
    },
    liked: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
