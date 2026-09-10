const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5200;


// ===============================
// MIDDLEWARE
// ===============================

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5173/",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);


// ===============================
// ROUTES
// ===============================

const userRoutes = require("../routes/user");
const productsRoutes = require("../routes/product");
const cartRoutes = require("../routes/cart");
const addressRoutes = require("../routes/address");
const wishRoutes = require("../routes/wish");
const paymentRoutes = require("../routes/Payment");


// User
app.use("/user", userRoutes);

// Products
app.use("/products", productsRoutes);

// Cart
app.use("/cart", cartRoutes);

// Address
app.use("/address", addressRoutes);

// Wishlist
app.use("/wish", wishRoutes);

// Payment
app.use("/payment", paymentRoutes);


// ===============================
// DATABASE
// ===============================

const connectDb = require("../config/db");

connectDb();


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Scientific Store API is running",
  });
});


// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});


// ===============================
// EXPORT
// ===============================

module.exports = app;