import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All product Get Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In category get API",
      error,
    });
  }
};

export const createCategorytController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "please provide category name",
      });
    }
    await categoryModel.create({ category });
    res.status(200).send({
      success: true,
      message: "category create successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In category Create API",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    // find product with this id
    const products = await productModel.find({ category: category._id });
    //update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      product.save();
    }
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "category delete successfully",
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
      message: "Error In delete category API",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    const { updatedCategory } = req.body;
    console.log(updatedCategory);
    // find product with this id
    const products = await productModel.find({ category: category._id });
    //update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      //product.category = req.body.category;
      product.category = updatedCategory;
      product.save();
    }
    if (updatedCategory) category.category = updatedCategory;

    await category.save();
    res.status(200).send({
      success: true,
      message: "category update successfully",
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
      message: "Error In update category API",
      error,
    });
  }
};
