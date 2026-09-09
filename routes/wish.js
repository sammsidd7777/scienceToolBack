const express = require('express')
const { protect } = require('../controllers/userCantroller')
const { AddtoWish, AllwishItem } = require('../controllers/wishControlles')
const router = express.Router()

router.use(protect)

router.get('/add/:productId',AddtoWish)
// router.get('/add/',(req,res)=>{
//     res.send("hyeee")
// })

router.get("/all",AllwishItem)

module.exports = router;