import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";  // Import fs module
import cors from "cors";  // Import cors module
import Product from "./models/product.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/Shoppi")
  .then(() => console.log("Connected to Local MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(path.join(uploadDir)));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const product = new Product({
            name,
            description,
            price,
            image: imagePath,
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
});

app.get("/api/products", async (req, res) => {
  try {
      const products = await Product.find();
      console.log("Fetched Products:", products);  // Debugging log
      res.status(200).json(products);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
