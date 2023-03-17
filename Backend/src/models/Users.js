const mongoose = require('mongoose')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    username:{type:"String", lowercase:true},
    email:{type:"String", lowercase:true, validate:{validator:(input)=>emailRegex.test(input), message:"Enter a valid email address"}},
    password:{type:"String"},
    address:{type:"String", lowercase:true},
    cart:Array
})

const users = mongoose.model("users", userSchema)

module.exports = users