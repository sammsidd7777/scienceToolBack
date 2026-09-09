const express = require("express");
const { CreateOrder, VarifyPayment, GetOrderDetails  } = require("../controllers/payment");

const router = express.Router()
 

router.get("/CreateOrder/:id/:num", CreateOrder)
router.post("/VerifiyPayment",VarifyPayment)
router.get("/OrderDetail",GetOrderDetails)


module.exports = router;