const express = require('express')
const router = express.Router()
const category = require("../middleware/category")

router.post("/category/:category", category.getCategory)
router.post("/onsale", category.getOnsale)

module.exports = router