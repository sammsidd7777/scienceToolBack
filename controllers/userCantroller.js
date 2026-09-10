const express = require("express");
const User = require("../models/UserModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const user = require("../models/UserModels");

// for signup user
const app = express();
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password ,userRole} = req.body;

    console.log( name, email, phone, password ,userRole)

    const newUser = await User.create({
      name,
      email,
      phone,
      userRole,
      password: await bcrypt.hash(password, 12), // Hash the password before saving
    });

    const userData = JSON.parse(JSON.stringify(newUser));
    // console.log(userData,"userdata");
     res.status(200).json({
      status: "succesful",
      message: "creating user: " + userData,
    });

  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "Fail",
      message: "Error creating user: " + error.message,
    });
  }
};

const createSendToken = async (user, req, res) => {
  const token = jwt.sign(
    { id: user._id },
     "siddarth",
      {
    expiresIn: `90d`, 
  }
);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  secure: true,
  sameSite: "none",
  });

   // Only send required user details
  const userDetail = {
    id: user._id,
    userName: user.name,
    email: user.email,
    role:user.userRole ||'user' ,
  };

  res.status(200).json({
    status: "ok",
    message: "Login successful",
    user: userDetail,
  });
};


exports.login = async (req, res) => { 
  try {
    const { email, password } = req.body;

    console.log(email,password)

    if (!email || !password) throw new Error("  Invalid attempt of email or password something messing   ");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Compare the password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      createSendToken(user, req, res); // Send the token if login is successful
    } else {
      res.status(401).json({
        status: "Fail",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
   
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 20 * 1000), // Expire the cookie quickly
      httpOnly: true,
      sameSite: "Strict",
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    res.status(200).json({
      status: "ok",
      message: "You successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};



exports.deleteUser = async (req, res) => {
  try {
    let userId = req.user._id; 
    console.log(userId)

    // Find and delete the user by _id
    const user = await User.findByIdAndDelete(userId);
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 20 * 1000), // Expire the cookie quickly
      httpOnly: true,
      sameSite: "Strict",
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    res.status(200).json({ status: "success", message: "User deleted successfully" });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ status: "error", message: "An error occurred while deleting the user" });
  }
};





exports.makeadmin = async (req, res) => {

  try {
   let userId =req.params.id;
   console.log(userId)

   

  //  let find user


  // let user= await User.find({_id:userId})
  
  let user =await User.updateOne({"_id": userId}, {$set: {userRole: "admin"} }, {upsert: true})
     
  console.log(user)


  res.status(200).json({status:"200",message:"work in progress"})


    
  } catch (error) {
    console.log(error.message)
    
  }
 
  
};
exports.removeAdmin = async (req, res) => {

  try {
   let userId =req.params.id;
   console.log(userId)

  
  let user =await User.updateOne({"_id": userId}, {$set: {userRole: "user"} }, {upsert: true})
    //  let user=await User.find({_id:userId})
  // console.log(user)


  res.status(200).json({status:"200",message:"work in progress",user})


    
  } catch (error) {
    console.log(error.message)
    
  }
 
  
};

// get all user detail 

exports.getAlluser=async(req,res)=>{
  try {
    let user= await User.find({},{name:1,phone:1,email:1,userRole:1})
  

    res.status(200).json({status:"200",message:user})
  } catch (error) {
    console.log(error.message)
  }
}


exports.protect = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in or authenticated",
      });
    }

    const payload = await promisify(jwt.verify)(req.cookies.jwt, "siddarth");
    console.log(payload);

    const user = await User.findById(payload.id);
    if (!user) throw new Error("User not found. The token no longer exists.");

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};

exports.restricted = async (req, res, next) => {
  const user = req.user;

  if (user.role === "admin") {
    return next();
  }

  res.status(403).json({
    status: "fail",
    message: "You are not authorized to perform this action",
  });
};


