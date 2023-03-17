const express = require('express')
const router = express.Router()
const product = require('../middleware/product')
const account = require('../middleware/account')

router.get("/product/:productId", product.getProduct)
router.post("/product/postReview", account.authorizeSession, product.writeReview)
router.put("/product/addCart", account.authorizeSession, product.addProductToCart)

module.exports = router