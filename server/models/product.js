import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  username: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, 
  bids: [bidSchema],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
