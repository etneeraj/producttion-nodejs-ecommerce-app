import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import connectDB from "./config/db.js";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
//dot env config
dotenv.config();
//database connection
connectDB();
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);
//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();
//middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//route
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productRoutes.js";
import categoryRoute from "./routes/categoryRoute.js";
import orderRoute from "./routes/orderRoute.js";
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Welcome to Node Server</h1>");
});
//Port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
  console.log(
    `SERVER RUNNING ON PORT ${PORT} on ${process.env.NODE_ENV} Mode`.bgMagenta
      .white
  );
});
