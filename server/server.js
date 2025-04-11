import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import bcrypt from "bcrypt"; // Import bcrypt
import Register from "./models/register.js";
import Product from "./models/product.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/Shoppi")
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
    // console.log("Fetched Products:", products); // Debugging log
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// const uplo= multer();
app.post("/register", upload.none(), async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await Register.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Register({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "User Registered Nahi hua" });
    console.log(error);
  }
});

const JWT_SECRET = "Sahil123";

app.post("/login", upload.none(), async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const User = await Register.findOne({ username });
    if (!User) {
      return res.status(600).json({ message: "User Does not exist" });
    }

    const match = await bcrypt.compare(password, User.password);
    if (!match) {
      return res.status(400).json({ message: "Password Incorrect" });
    }

    const token = jwt.sign(
      { id: User._id, username: User.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await Product.findByIdAndDelete(id);
    res.json({ message: "Backend Delete Complete" });
  } catch (error) {
    console.log("Error Deleting", error);
    res.status(500).json({ error: "fail hogye backend mai delete karte time" });
  }
});

// Socket.io - Real-time bid handling
io.on("connection", (socket) => {
  console.log("User connected via socket", socket.id);
  socket.emit("connected", { msg: "Socket connected successfully!" });

  socket.on("placebid", async ({ productId, amount }) => {
    try {
      // Get the token from socket handshake auth data and verify it
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, JWT_SECRET);
      const username = decoded.username;
      console.log("Decoded JWT:", decoded.username);

      const product = await Product.findById(productId);
      if (!product) return;

      // Create a new bid object using current time from Date.now()
      const newBid = { amount, username, time: Date.now() };

      product.bids.push(newBid);
      console.log("Saving Bid:", newBid);
      console.log("Product Before Save:", product);
      await product.save();

      // Broadcast the new bid to all connected clients
      io.emit("bidUpdated", { productId, latestBid: newBid });
    } catch (err) {
      console.error("Error placing bid via socket:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from socket");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
