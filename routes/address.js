const express= require('express');

const {addAddress}=require("../controllers/addressCantrooles");
const { protect } = require('../controllers/userCantroller');
const router= express.Router();



router.get('/', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Welcome to address!"
    });
})


router.use(protect)


router.post('/add',addAddress)

module.exports=router;