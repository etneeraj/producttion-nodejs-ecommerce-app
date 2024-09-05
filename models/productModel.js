import mongoose from "mongoose";
//Review Model
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: [true, "name is required"] },
  comment: { type: String },
  rating: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User Required"],
  },
});
//Product Model
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    stock: { type: Number, required: [true, "Quantity is required"] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Products", ProductSchema);
export default productModel;
