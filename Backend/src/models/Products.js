const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    reviews:Array,
    productImages:Array,
    category:String,
    credit:String,
    featured:Boolean,
    onsale:Boolean
})

const products = mongoose.model("products", productSchema)

module.exports = products