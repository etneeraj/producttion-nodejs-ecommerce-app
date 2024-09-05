import express from "express";
import {
  createProductController,
  getAllProductController,
  getproductByIdController,
  updateProductContrller,
  updateProductImageContrller,
  deleteProductImageContrller,
  deleteProductController,
  reviewProductController,
  getTopProductController,
} from "../controllers/productController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();
//get all product
router.get("/getallproduct", getAllProductController);
router.get("/getTopproduct", getTopProductController);
router.get("/:id", getproductByIdController);
router.post(
  "/create-product",
  isAuth,
  isAdmin,
  singleUpload,
  createProductController
);
router.put("/:id", isAuth, isAdmin, updateProductContrller);
router.put(
  "/updateproductImage/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageContrller
);
router.delete(
  "/deleteproductImage/:id",
  isAuth,
  isAdmin,
  deleteProductImageContrller
);
router.delete("/deleteproduct/:id", isAuth, isAdmin, deleteProductController);

router.put("/reviewproduct/:id", isAuth, reviewProductController);

export default router;
