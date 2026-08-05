import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  location: string;
  rating: number;
  productName: string;
  productLink?: string;
  date: Date;
  text: string;
  quote: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  posterUrl?: string;
  approved: boolean;
}

const ReviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  productName: { type: String, required: true },
  productLink: { type: String },
  date: { type: Date, default: Date.now },
  text: { type: String, required: true },
  quote: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  mediaUrl: { type: String, required: true },
  posterUrl: { type: String },
  approved: { type: Boolean, default: false },
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
