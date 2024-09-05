import express from "express";
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import {
  getOrderController,
  createOrderController,
  getOrderByIdController,
  acceptPaymentController,
  getAllOrderbyadminController,
  changeOrderStatusController,
} from "../controllers/orderController.js";

const router = express.Router();
router.get("/getmyorder", isAuth, getOrderController);

router.post("/create", isAuth, createOrderController);
router.get("/orderbyId/:id", isAuth, getOrderByIdController);

router.post("/payments", isAuth, acceptPaymentController);
//Admin
router.get(
  "/admin/get-all-order",
  isAuth,
  isAdmin,
  getAllOrderbyadminController
);
router.put(
  "/admin/changeorderstatus/:id",
  isAuth,
  isAdmin,
  changeOrderStatusController
);
export default router;
