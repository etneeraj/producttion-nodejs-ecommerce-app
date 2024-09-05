import express from "express";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllCategoryController,
  createCategorytController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/getallcategory", getAllCategoryController);

router.post("/create", isAuth, isAdmin, createCategorytController);
router.delete("/deleteCategory/:id", isAuth, isAdmin, deleteCategoryController);
router.put("/updateCategory/:id", isAuth, isAdmin, updateCategoryController);

export default router;
