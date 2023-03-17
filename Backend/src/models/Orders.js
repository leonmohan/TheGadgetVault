const mongoose = require('mongoose')

const ordersSchema = new mongoose.Schema({
    cart:Array,
    username:String,
    created:Date,
    address:String
})

const orders = mongoose.model("orders", ordersSchema)

module.exports = orders