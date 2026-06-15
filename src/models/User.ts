import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          size: { type: String, required: true },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (this: any) {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);

