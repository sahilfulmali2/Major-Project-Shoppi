import mongoose from "mongoose";

const itemSchema= new mongoose.Schema({
  name:{type: String, required:true},
  description:{type: String, required:true},
  category:{type: String, required:true},
  price:{type: Number, required:true},
  quantity:{type: Number, required:true},
  images:{type: String, required:true},
})

const Item= mongoose.model("Item", itemSchema);
export default Item;