const express = require("express");

const {
  addProduct,
  allproduct,
  detail,
  DeleteProduct,
  addBulk,
  homeData,
} = require("../controllers/productCantroller");

const upload = require("../middleware/multer");

const router = express.Router();


router.post("/add-bulk", addBulk);
// ===============================
// TEST / ROOT
// ===============================

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Welcome to Product API!",
  });
});


// ===============================
// ADD PRODUCTS
// ===============================

// Bulk products

// Single product with images
router.post(
  "/add",
  upload.array("productImg", 10),
  addProduct
);


// ===============================
// GET PRODUCTS
// ===============================

// All active products
router.get("/all", allproduct);

// Homepage products
router.get("/home", homeData);

// Single product details
router.get("/detail/:id", detail);


// ===============================
// DELETE PRODUCT
// ===============================

router.delete("/delete/:id", DeleteProduct);


module.exports = router;