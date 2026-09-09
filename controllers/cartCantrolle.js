const express = require('express');
const Product = require("../models/ProductModels");
const User = require("../models/UserModels")

// for adding product to cart
const app = express();
app.use(express.json());

// Add product into cart
exports.Addtocart = async (req, res) => {
    try {
        let productId = req.params.productId;
        let user = req.user;

        if (!user) {
            return res.status(400).json({ status: "error", message: "User not login" });
        }

        // Find the product by its ID
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Check if the product is already in the cart
        let cart = user.cart;
        let itemIndex = cart.findIndex(el => el.productId === productId);

        // Add or update the product in the cart
        if (itemIndex === -1) {
            // Add product to the cart with relevant information
            user.cart.push({
                productId: productId,
                productTitle: product.productName,
                productPrice: product.productPrice,
                productImg: product.productImg[0],
                quantity: 1
            });
            await user.save();
            console.log(user) // Save the updated cart
            res.status(201).json({ status: "success", message: user.cart });
        } else {
            // Update the quantity of the product in the cart
            user.cart[itemIndex].quantity++;
            await user.save();  // Save the updated cart
            res.status(200).json({ status: "success", message: user.cart });
        }

    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(400).json({ status: "error", message: error.message });
    }
};



// Update product quantity in the cart
exports.updateQuantity = async (req, res) => {
  try {
    const { id, num } = req.params;

    // Get logged-in user's ID
    const userId = req.user._id;

    // Convert quantity to number
    const quantity = Number(num);

    // Validate quantity
    if (Number.isNaN(quantity)) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be a number",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be greater than or equal to 0",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Find cart item

    console.log(user.cart,"cart");
    
    const cartItem = user.cart.id(id);

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: user.car,
      });
    }

    // Remove item when quantity is 0
    if (quantity === 0) {
      cartItem.deleteOne();

      await user.save();

      return res.status(200).json({
        status: "success",
        message: "Item removed from cart",
        cart: user.cart,
      });
    }

    // Update quantity
    cartItem.quantity = quantity;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Quantity updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Update quantity error:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


// get all item from cart 

exports.AllcartItem = async (req, res) => {
    try {
        let user = req.user;


        const Cartdata = await user.cart;  // Assuming Cartdata is an array of products
        let number = [];

        number.push(...Cartdata);  // Spread Cartdata array into 'number' if it's an array of items



        let x = 0;
        let totalprodcut = 0;
        let totalPrice = 0

        number.map((el) => {
            if (el.quantity >= 0) {
                totalprodcut += el.quantity;
                totalPrice += el.productPrice
            }
            x = x + 1;
        });

        console.log(totalprodcut);
        console.log(totalPrice);



        res.status(200).json({ status: "success", message: { Cartdata, totalPrice, totalprodcut } });

    } catch (error) {
        // Send an error response with a message if something goes wrong
        console.error(error);  // Optional: For debugging purposes
        res.status(400).json({ status: "error", message: "Failed to retrieve cart items." });
    }
};



// delete cart product 

exports.DeletecartItem = async (req, res) => {
    try {
        const item = req.params.id;
        const user = req.user;
        let cart = user.cart;

        let update =cart.filter(el=>el.productId !== item)
      

        
        user.cart = update;

      
        await user.save();

    
        res.status(200).json({
            status: "200",
            message: "Item successfully removed from the cart",
            cart: update
        });

    } catch (error) {
        // console.log(error.message);
        res.status(500).json({
            status: "500",
            message: error.message
        });
    }
};




// exports.AllcartItem = async (req, res) => {
//     try {
//         let user = req.user;

//         // Assuming user.cart is an array of product IDs and quantities, like [{ productId: 'abc123', quantity: 2 }]
//         const cartItems = user.cart;

//         // Extract product IDs from cartItems
//         const productIds = cartItems.map(item => item.productId);

//         // Find the products in the database using the product IDs
//         let products = await Product.find({ '_id': { $in: productIds } });

//         // Map the products with quantities from the cartItems
//         const Cartdata = cartItems.map(item => {
//             const product = products.find(p => p._id.toString() === item.productId.toString());
//             return {
//                 product,
//                 quantity: item.quantity
//             };
//         });
//         console.log(Cartdata)

//         // Respond with the cart data
//         res.status(200).json({ status: "success", message: Cartdata });
//     } catch (error) {
//         console.error(error); // Log error for debugging
//         res.status(400).json({ status: "error", message: "An error occurred" });
//     }
// };
