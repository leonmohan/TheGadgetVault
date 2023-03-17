const express = require('express')
const router = express.Router()

const home = require("../middleware/home")

router.get("/homeDisplayProducts", home.getHomeDisplay)
router.get("/", (req, res)=>{res.redirect("https://store.thegadgetvault.online")})

module.exports = router