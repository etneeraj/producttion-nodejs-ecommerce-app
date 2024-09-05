import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
//get all product
export const getAllProductController = async (req, res) => {
  const { keyword, category } = req.body;
  try {
    const products = await productModel
      .find({
        name: {
          $regex: keyword ? keyword : "",
          $options: "i",
        },
        // category: category ? category : null,
      })
      .populate("category");
    res.status(200).send({
      success: false,
      message: "All product Get Successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Product Get API",
      error,
    });
  }
};
//Get Top Product
export const getTopProductController = async (req, res) => {
  try {
    const product = await productModel.find({}).sort({ rating: -1 }).limit(3);
    return res.status(200).send({
      success: true,
      message: "Product Fetch Successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Product Get API",
      error,
    });
  }
};
//get product by id
export const getproductByIdController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product Not Fond",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Fetch successfully",
      product,
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
      message: "Error In Product by ID Get API",
      error,
    });
  }
};
//create product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, images, category } = req.body;
    if (!name || !description || !price || !stock) {
      return res
        .status(500)
        .send({ success: false, message: "please provide all field" });
    }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
    }
    const file = getDataUri(req.file);
    const cbd = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cbd.public_id,
      url: cbd.secure_url,
    };
    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    res.status(201).send({
      success: true,
      message: "Product Saved Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Product Create API",
      error,
    });
  }
};
//Update Product
export const updateProductContrller = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    console.log(req.body.price);
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
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
// Update Product Image
export const updateProductImageContrller = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
    }
    const file = getDataUri(req.file);
    const cbd = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cbd.public_id,
      url: cbd.secure_url,
    };
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Image Updated Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Product Create API",
      error,
    });
  }
};
//delete product images
export const deleteProductImageContrller = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    const id = req.query.id;
    if (!id) {
      res.status(404).send({
        success: false,
        message: "image not found",
      });
    }
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    // delete image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    product.save();
    return res
      .status(200)
      .send({ success: true, message: "Image Deleted Successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Product Create API",
      error,
    });
  }
};
//delete product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(500).send({
        success: false,
        message: "Product Not Found",
      });
    }
    // find & delete image
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "product Delete Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In Product Create API",
      error,
    });
  }
};
// Review for product
export const reviewProductController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find product
    const product = await productModel.findById(req.params.id);
    // check previous review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Alredy Reviewed",
      });
    }
    // review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // passing review object to reviews array
    product.reviews.push(review);
    // number or reviews
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added!",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Review Comment API",
      error,
    });
  }
};
