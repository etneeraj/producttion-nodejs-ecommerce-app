import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
// User Auth
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  //validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthrized User",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeData._id);
  console.log(decodeData);
  next();
};

// Admin Auth
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "admin only",
    });
  }
  next();
};
