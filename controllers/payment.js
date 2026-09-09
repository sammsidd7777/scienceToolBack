const express = require("express");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Products = require("../models/ProductModels");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID,
  key_secret: process.env.RAZ_KEY_SECRET,
});

// console.log(process.env.RAZ_KEY_ID)


// CreateOrder: Create an order in Razorpay
exports.CreateOrder = async (req, res) => {
  

  try {
    // Find the product by its ID
    const {id,num} = req.params;
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ status: "404", message: "Product not found" });
    }

    // Validate the product price
    if (!product.productPrice || product.productPrice <= 0) {
      return res.status(400).json({ status: "400", message: "Invalid product price" });
    }

    const quantity = Number(num);

    // Razorpay order options
    const options = {
      amount: product.productPrice * 100* quantity, 
      currency: "INR",
      notes: {
        "productname": product.productName,
        "productId": productId,
        "Brand": product.productBrand,
      },
      receipt: "receipt_" + Math.random().toString(36).substring(7), // Unique receipt ID
    };

    // Create the order in Razorpay
    const order = await razorpay.orders.create(options);
    console.log(order);  // For debugging

    // Return the order response
    res.status(200).json({ status: "200", message: order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "500", message: error.message });
  }
};



exports.VarifyPayment=async(req,res)=>{

    try {
        const {razorpay_order_id ,razorpay_payment_id,razorpay_signature}=req.body;

        if(!razorpay_order_id || !razorpay_payment_id||!razorpay_signature){
            return res.status(400).json({status:"400",message:"Missing payment data"})
        }

        const sign =razorpay_order_id +'|'+razorpay_payment_id;
        const expectedSign=crypto.createHmac("sh256".process.env.RAZ_KEY_SECRET).update(sign.toString()).digest("hex")
        
        if(razorpay_signature === expectedSign){
            res.status(200).json({status:"200",message:"payment verified succesfully"})
        }else{
            res.status(400).json({status:"400",message:"invalid payment signature"})
        }
        
    } catch (error) {
        res.status(400).json({status:"400",message:error.message})
    }
}



exports.GetOrderDetails=async(req,res,next)=>{
    try {
        razorpay.order.fetch(req.body.orderId).then(order=>{
            const notes =order;

            res.status(200).json(notes)
        })
    } catch (error) {
        next(error)
    }
}