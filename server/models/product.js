import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
  amount: { type: Number, required: true },
  username: { type: String, required: true },
  time: { type: Date, default: Date.now },
  tokenPaid: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  bids: [bidSchema],
  highestBid: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
    amount: Number,
    username: String,
    name: String,
    time: Date,
    tokenPaid: Boolean,
  },

  status: {
    type: String,
    enum: ["Available", "Sold"],
    default: "Available",
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
