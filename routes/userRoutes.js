import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updatePassword,
  updateProfileController,
  updateProfilePic,
  forgotPasswordController,
} from "../controllers/userController.js";
import { isAuth } from "../middleware/authMiddleware.js";
import { singleUpload } from "../middleware/multer.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
//router object
const router = express.Router();

//routes
//Register
router.post("/register", limiter, registerController);
//Login
router.post("/login", limiter, loginController);
//Fetch User Details
router.get("/Profile", isAuth, getUserProfileController);
//Logout
router.get("/logout", logoutController);
//Logout
router.put("/update-profile", isAuth, updateProfileController);
router.put("/update-password", isAuth, updatePassword);

router.put("/update-picture", isAuth, singleUpload, updateProfilePic);

router.post("/resetPasword", isAuth, forgotPasswordController);
export default router;
