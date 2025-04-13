import jwt from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      decoded.username !== process.env.ADMIN_USERNAME ||
      decoded.role !== "admin"
    ) {
      return res.status(403).json("Access Rejected, Not Admin");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json("Token ki Galti Admin");
  }
};

export default isAdmin;
