const mongoose = require('mongoose')

const sessionsSchema = new mongoose.Schema({
    username:String,
    sessionId:String,
    expireDate:Date
})

const sessions = mongoose.model("session", sessionsSchema)

module.exports = sessions