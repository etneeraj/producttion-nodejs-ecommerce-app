import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";
export const getOrderController = async (req, res) => {
  try {
    const order = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All Order Get Successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In get order API",
      error,
    });
  }
};
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    //valdiation
    // create order
    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(500).send({
        success: false,
        message: "Order Not Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Order Fetch Sucessfully",
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Product Create API",
      error,
    });
  }
};

export const acceptPaymentController = async (req, res) => {
  const { totalAmount } = req.body;
  if (!totalAmount) {
    return res.status(500).send({
      success: false,
      message: "Total Amount is required",
    });
  }
  try {
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount) * 100,
      currency: "inr",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Payment API",
      error,
    });
  }
};
///Admin  Part
export const getAllOrderbyadminController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    if (!orders) {
      return res.status(200).send({
        success: false,
        message: "No order Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "All Order Fetch Successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Get API",
      error,
    });
  }
};

export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    console.log(order);
    if (!order) {
      return res.status(200).send({
        success: false,
        message: "No order Found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "processing") {
      order.orderStatus = "delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "Order Already Delivered",
      });
    }
    await order.save();
    return res.status(200).send({
      success: true,
      message: "Order Status Update Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Get API",
      error,
    });
  }
};
