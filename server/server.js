import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

//MONGODB MODELS
import Register from "./models/register.js";
import Product from "./models/product.js";
import Item from "./models/items.js";
import Order from "./models/Order.js";
import Chat from "./models/Chat.js";

//MIDDLEWARES
import isAdmin from "./middlewares/isAdmin.js";
import isLoggedin from "./middlewares/isLoggedin.js";

//EMAIL MODELS NODEMAILER
import { OrderConfirm } from "./controllers/OrderConfirm.js";
import { sendEmail } from "./controllers/Sendmail.js";
import { Bidmail } from "./controllers/Bidmail.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

app.post("/api/products", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = new Product({
      name,
      description,
      price,
      image: imagePath,
    });
    // console.log(product);
    await product.save();
    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

app.get("/buy/products/:id", async (req, res) => {
  try {
    const product = await Item.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

app.post("/admin/add", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(req.body);
    const item = new Item({
      name,
      description,
      price,
      category,
      images: imagePath,
      quantity,
    });
    console.log(item);
    await item.save();
    res.status(201).json({
      message: "Category Product Added",
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
    console.log(error);
  }
});

app.get("/items", async (req, res) => {
  try {
    const products = await Item.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);

    console.log("Order received:", req.body);

    res.status(201).json({ message: "Order saved successfully" });

    try {
      console.log("Sending email to:", req.body.email);
      await OrderConfirm(order.name, req.body.email);
    } catch (err) {
      console.log("Email sending failed:", err);
    }
    await order.save();
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ error: "Error saving order" });
  }
});

app.get("/items/category/:categoryname", async (req, res) => {
  try {
    const category = req.params.categoryname;
    const products = await Item.find({ category });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
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

// Sell route
app.post("/api/sell/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { name, username, bidAmount } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product || product.status === "Sold") {
      return res
        .status(400)
        .json({ message: "Product not available for selling" });
    }
    const productname = product.name;
    product.status = "Sold";
    await product.save();

    try {
      await Bidmail(name, username, bidAmount, productname);
    } catch (err) {
      console.log("Email sending failed:", err);
    }

    res.json({ message: "Product sold successfully and email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { name, username, password, tokenamount } = req.body;

    if (!name || !username || !password || !tokenamount) {
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
      wallet: tokenamount,
    });

    await newUser.save();

    try {
      await sendEmail(name, username);
    } catch (err) {
      console.log("Email sending failed:", err);
    }

    res.status(201).json({ message: "User Registered Sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "User Registered Nahi hua" });
    console.log(error);
  }
});

app.post("/login", upload.none(), async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const JWT_SECRET = process.env.JWT_SECRET;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //if the username is admin or not
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign(
        { username, role: "admin", name: "Admin" },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.json({
        message: "Admin login successful",
        token,
        role: "admin",
      });
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
      { id: User._id, username: User.username, name: User.name },
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
  console.log("🟢 New client connected:", socket.id);
  socket.emit("connected", { msg: "Socket connected successfully!" });

  // --- Bid Logic (Seems mostly okay, kept as is) ---
  socket.on("placebid", async ({ productId, amount }) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
             socket.emit("bidRejected", { reason: "Authentication token not provided." });
             return;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const name = decoded.name;
        const username = decoded.username;

        const user = await Register.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            socket.emit("bidRejected", { reason: "User or product not found." });
            return;
        }

        const basePrice = product.price;
        const highestBidAmount = product.bids.length > 0
            ? Math.max(...product.bids.map((bid) => bid.amount))
            : 0; // Renamed variable for clarity

        if (amount <= basePrice || amount <= highestBidAmount) {
            socket.emit("bidRejected", {
                reason: `Your bid must be greater than base price (₹${basePrice}) and highest bid (₹${highestBidAmount}).`,
            });
            return;
        }

        // Check if user is already highest bidder
        if (product.highestBid?.userId?.toString() === user._id.toString()) {
            socket.emit("bidRejected", {
                reason: "You are already the highest bidder.",
            });
            return;
        }

        // Refund token to previous highest bidder *before* deducting from new bidder
        if (product.highestBid?.userId) {
            const prevBidder = await Register.findById(product.highestBid.userId);
            if (prevBidder && prevBidder._id.toString() !== user._id.toString()) { // Don't refund if same user bids higher
                prevBidder.wallet += 1000; // Assuming token cost is 1000
                await prevBidder.save();
                 console.log(`Refunded token to previous bidder: ${prevBidder.username}`);
                 // Optionally notify previous bidder about refund via socket if they are connected
                 // io.to(`user_${prevBidder._id.toString()}`).emit('tokenRefunded', { amount: 1000 });
            }
        }

        // Deduct token from current bidder
        if (user.wallet < 1000) { // Assuming token cost is 1000
            socket.emit("bidRejected", {
                reason: "Insufficient wallet balance for token.",
            });
            return;
        }

        user.wallet -= 1000; // Deduct token cost
        await user.save();
        console.log(`Deducted token from bidder: ${user.username}`);


        const newBid = {
            userId: user._id,
            username,
            amount,
            name,
            time: new Date(), // Use Date object
            tokenPaid: true,
        };

        product.highestBid = newBid;
        product.bids.push(newBid);
        await product.save();

         // Notify all clients about new bid
         // Consider sending to a product-specific room if you have many products: io.to(`product_${productId}`).emit(...)
        io.emit("bidUpdated", { productId, latestBid: newBid, newHighestBidder: user.username });
        console.log(`Bid placed successfully by ${user.username} on product ${productId}`);


    } catch (err) {
        console.error("Error placing bid via socket:", err.message);
         if (err.name === 'JsonWebTokenError') {
             socket.emit("bidRejected", { reason: "Invalid authentication token." });
         } else {
             socket.emit("bidRejected", { reason: "An error occurred while placing bid." });
         }
    }
});


  // --- Chat Logic ---

  // Admin joins their dedicated room
  socket.on("joinAdmin", () => {
    console.log(`Admin (${socket.id}) joined the admin room`);
    socket.join("admin_room"); // Admin's socket joins 'admin_room'
    // You could potentially verify here if the socket *should* be admin
  });

  // *** IMPORTANT: User joins their specific room ***
  socket.on("joinUser", (userId) => {
    if (userId) {
      const userRoom = `user_${userId}`;
      console.log(`User (${socket.id}) joined their room: ${userRoom}`);
      socket.join(userRoom); // User's socket joins 'user_USERID' room
    } else {
       console.warn(`User (${socket.id}) tried to join without userId.`);
    }
  });

  // User sends a message -> forward to Admin room
  socket.on("userMessage", async ({ message }) => {
    try {
      const token = socket.handshake.auth.token;
       if (!token) {
           console.warn(`User message received without token from ${socket.id}`);
           // Optionally emit an error back to the user socket
           socket.emit('authError', { message: 'Authentication required to send messages.' });
           return;
       }
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
      const username = decoded.username;
      const name = decoded.name; // Assuming name is in token

      const msgPayload = {
        senderId: userId, // Use senderId consistently
        senderName: name || username, // Use name, fallback to username
        message: message,
        timestamp: new Date(), // Use standard Date object
      };

      // Emit this message only to sockets in 'admin_room'
      io.to("admin_room").emit("receiveUserMessage", msgPayload);
      console.log(`Forwarded message from User (${userId}) to admin room`);

    } catch (err) {
       console.error("Error processing userMessage:", err.message);
        if (err.name === 'JsonWebTokenError') {
             socket.emit('authError', { message: 'Invalid token. Cannot send message.' });
         }
    }
  });

  // Admin sends a message -> forward to specific User room
  socket.on("adminMessage", async ({ toUserId, message }) => {
    // Optional: Add verification here to ensure the sender *is* admin
    // e.g., check if socket.id is in a list of known admin socket IDs or if it's in 'admin_room'
    // const isAdmin = socket.rooms.has('admin_room');
    // if (!isAdmin) { console.warn(...); return; }

    try {
      const msgPayload = {
        senderType: "Admin", // Identify sender type
        message: message,
        timestamp: new Date(),
      };

      const userRoom = `user_${toUserId}`;
      // Emit this message only to sockets in the specific user's room
      io.to(userRoom).emit("receiveAdminMessage", msgPayload);
      console.log(`Sent admin message to User (${toUserId}) in room ${userRoom}`);

    } catch (err) {
      console.error("Error sending admin message:", err.message);
      // Optionally emit error back to admin socket
      // socket.emit('messageSendError', { userId: toUserId, reason: err.message });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}. Reason: ${reason}`);
    // Optional: If you maintain a list of active users/admins, remove them here
    // If a user disconnects, you might want to notify the admin
    // If the admin disconnects, you might want to notify users
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
