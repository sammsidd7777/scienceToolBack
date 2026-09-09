const express = require('express');
const Product = require("../models/ProductModels");
const User = require("../models/UserModels")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify, convertProcessSignalToExitCode } = require("util");


// Initialize Express app

// Add product to the wishlist
exports.AddtoWish = async (req, res) => {
    // console.log(req)
    try {
        const productId = req.params.productId;
        console.log(productId)
        const user = req.user;

       

        // Use findById directly with the productId
        const product = await Product.findById(productId);
    

        if (!product) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

    
        user.wish.push(productId);
        await user.save();
        console.log(user)


        // Response
        res.status(200).json({ status: "success", message: "Product added to wishlist", product });

    } catch (error) {
      
        console.error(error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
};


// Get all items from the wishlist
exports.AllwishItem = async (req, res) => {
    try {
        const user = req.user;

        // Ensure the user has a wishlist
        if (!user.wish || user.wish.length === 0) {
            return res.status(404).json({ status: "error", message: "Your wishlist is empty" });
        }

            const data = await user.wish.productId;
    
    
            const find = await Product.find(data);

            
    
            const Wishdata = []
    
            Wishdata.push(find)
    
console.log(Wishdata,"wish")
            res.status(200).json({ status: "success", message: Wishdata });
        } catch (error) {
    
            res.status(400)
        }};
