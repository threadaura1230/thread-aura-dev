import mongoose from "mongoose";

const SubCollectionSchema = new mongoose.Schema(
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
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.models.SubCollection ||
  mongoose.model("SubCollection", SubCollectionSchema);
