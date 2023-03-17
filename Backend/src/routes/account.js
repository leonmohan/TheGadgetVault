const express = require('express')
const router = express.Router()

const account = require("../middleware/account.js")

router.get("/getAccount", account.authorizeSession, account.getAccount)
router.post("/createAccount", account.createAccount)
router.post("/loginAccount", account.loginAccount)
router.put("/updateAccount", account.authorizeSession, account.updateAccount)
router.delete("/logoutAccount", account.authorizeSession, account.logoutUser)


module.exports = router