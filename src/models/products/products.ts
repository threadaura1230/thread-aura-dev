import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
    subCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCollection",
    },
    material: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "#1f332a",
    },
    sizes: {
      type: [String],
      default: ["2.4", "2.6", "2.8"],
    },
    details: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
