const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, brand } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

        let imageUrl = "";
        let localImage = "";

      if (req.file) {

          localImage = `/uploads/${req.file.filename}`;

          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "products"
          });

          imageUrl = result.secure_url;

        //   fs.unlinkSync(req.file.path);

      }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      image: imageUrl,
      brand
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const viewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const viewSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  addProduct,
  viewProducts,
  viewSingleProduct,
  updateProduct,
  deleteProduct
};