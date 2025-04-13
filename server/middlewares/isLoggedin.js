import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isLoggedin =(req,res,next)=>{

  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if(!token){
    return res.status(401).json({message: "Unauthorized. Please Login."})
  }

  try {
    const decode= jwt.verify(token,process.env.JWT_SECRET);
    req.user=decode;
    next();
  } 
  catch (error) {
      return res.status(401).json({message: "Invalid Token. Please Login Again"})
  }
  
}
export default isLoggedin;