const express = require("express")
const router = express.Router()

const account = require("../middleware/account")
const orders = require("../middleware/orders")

router.get("/orderHistory", account.authorizeSession, orders.getOrders)

module.exports = router