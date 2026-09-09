const express = require("express");

const {
  logout,
  signup,
  login,
  protect,
  deleteUser,
  makeadmin,
  getAlluser,
  removeAdmin,
} = require("../controllers/userCantroller");

const router = express.Router();


// ===============================
// TEST
// ===============================

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Welcome to User API!",
  });
});


// ===============================
// AUTH
// ===============================

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);


// ===============================
// ADMIN / USER LIST
// ===============================

// Get all users
router.get("/all", getAlluser);


// ===============================
// PROTECTED ROUTES
// ===============================

router.use(protect);


// Current logged-in user
router.get("/current", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: req.user,
  });
});


// Logout
router.post("/logout", logout);


// ===============================
// ADMIN MANAGEMENT
// ===============================

// Make user admin
router.patch("/makeadmin/:id", makeadmin);

// Remove admin role
router.patch("/removeadmin/:id", removeAdmin);


// ===============================
// DELETE ACCOUNT
// ===============================

router.delete("/delete", deleteUser);


module.exports = router;