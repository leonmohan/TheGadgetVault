const express = require('express')
const router = express.Router()

const search = require("../middleware/search")

router.get("/search/:searchText", search.searchProducts)

module.exports = router