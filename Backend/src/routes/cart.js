const express = require('express')
const router = express.Router()

const account = require("../middleware/account")
const cart = require("../middleware/cart")

router.delete("/deleteFromCart", account.authorizeSession, cart.deleteFromCart)
router.put("/updateQuantity", account.authorizeSession, cart.updateQuantity)
router.post("/checkout", account.authorizeSession, cart.checkout)
router.post("/checkoutSuccess", express.raw({type:'application/json'}), cart.stripeCheckoutSuccess)

module.exports = router
