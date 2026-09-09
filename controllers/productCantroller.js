const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/ProductModels");
const sizeOf = require("image-size");
const { error } = require("console");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const upload = require("../middleware/multer");







const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

exports.addProduct = async (req, res) => {
  const {
    productName,
    productCategory,
    productPrice,
    productDescription,
  } = req.body;

  if (
    !productName ||
    !productCategory ||
    productPrice === undefined ||
    productPrice === null ||
    !productDescription
  ) {
    return res.status(400).json({
      status: "error",
      message: "Missing required product fields.",
    });
  }

  return createNewProduct(req, res);
};

exports.addBulk = async (req, res) => {
  try {
    const bulkData = req.body;

    if (!Array.isArray(bulkData)) {
      return res.status(400).json({
        success: false,
        message: "Bulk data must be an array.",
      });
    }

    const products = bulkData.map((item) => ({
      productName: item.productName,
      productCategory: item.productCategory,
      productDescription: item.productDescription || "",

      productPrice: Number(item.productPrice),
      discountPrice: Number(item.discountPrice || 0),

      productImg: item.productImg || [],

      stock: Number(item.stock || 0),

      featured: item.featured || false,

      status: item.status || "Active",
    }));

    const createdProducts = await Product.insertMany(products);

    return res.status(201).json({
      success: true,
      products: createdProducts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// CREATE SINGLE PRODUCT
// ===============================

const createNewProduct = async (req, res) => {
  try {
    let images = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        )
      );

      images = uploads.map(
        (img) => img.secure_url
      );
    }

    const newProduct = await Product.create({
      productName: req.body.productName,

      productCategory: req.body.productCategory,

      productDescription:
        req.body.productDescription || "",

      productPrice: Number(
        req.body.productPrice
      ),

      discountPrice: Number(
        req.body.discountPrice || 0
      ),

      productImg: images,

      stock: Number(
        req.body.stock || 0
      ),

      featured:
        req.body.featured === "true",

      status:
        req.body.status || "Active",
    });

    return res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// HOME DATA
// ===============================

exports.homeData = async (req, res) => {
  try {
    const featured = await Product.find({
      featured: true,
      status: "Active",
    });

    const products = await Product.find({
      status: "Active",
    }).limit(12);

    res.status(200).json({
      status: "OK",
      message: {
        featured,
        products,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


// ===============================
// ALL PRODUCTS
// ===============================

exports.allproduct = async (req, res) => {
  try {
    const products = await Product.find({
      status: "Active",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "OK",
      message: {
        products,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


// ===============================
// PRODUCT DETAIL
// ===============================

exports.detail = async (req, res) => {
  try {
    const product_detail = await Product.findById(req.params.id);

    if (!product_detail) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Same category products
    const product = await Product.find({
      productCategory: product_detail.productCategory,
      _id: { $ne: product_detail._id },
      status: "Active",
    }).limit(8);

    const datas = {
      product_detail,
      product,
    };

    res.status(200).json({
      status: "OK",
      message: {
        datas,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }
};


// ===============================
// DELETE PRODUCT
// ===============================

exports.DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
