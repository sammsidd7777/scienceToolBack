const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt");
// const { Addtocart } = require("../controllers/cartCantrolle");


const cartSchema = new mongoose.Schema({
  productId: {
    type: String,
   
  },
  productTitle:{
      type:String,
  },
  productPrice:{
      type:Number
  },
  productImg:{
    type:[]

  },
  quantity:{
    type: Number}
 
})

const wishSchema = new mongoose.Schema({
  productId: {
    type: String,
   
  }
 
 
})

const AddressSchema = new mongoose.Schema({
  FlatNo: {
    type: String,
    
   
  },
  AddressNo:{
    type: String,
   
  },
  city:{
    type: String,
  },
  state:{
    type: String,
  },
  pinCode:{
    type: String,
  }
 
})


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: [10, "please enter a valid phone number"],
    validate: [validator.isMobilePhone, "please enter a valid number"],
  },

  userRole:{
    type: [String], 
    default: ["user"],
  },

  password: {
    type: String,
    required: true,

    minlength: [8, "Please enter a valid password"],
  },
  cart:[cartSchema],

  wish:[wishSchema],

  Address:[AddressSchema]

});



const user=mongoose.model('User',userSchema);
module.exports = user; 
