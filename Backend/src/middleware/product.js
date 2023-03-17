const db = require("../config/db")
const Products = require("../models/Products")
const Sessions = require("../models/Sessions")
const Users = require("../models/Users")
const token = require('../security/token')
const mongoose = require('mongoose')

module.exports = 
{
    getProduct: async (req, res) => 
    {
        try
        {
            const productIdParameter = req.params.productId
            
            //Validation: Checks if the parameter matches an ObjectId using regex
            if(!mongoose.isValidObjectId(productIdParameter))
            {
                throw Object.assign(new Error("Product id is invalid"), 
                { 
                    data: 
                    {
                      errorCode: 400,
                      errorMessage: "The product id is invalid"
                    }
                });
            }

            await db()
            const product = await Products.findById(mongoose.Types.ObjectId(productIdParameter))

            //Validation: Check if any products exists with that id
            if(!product)
            {
                throw Object.assign(new Error("Could not find any products from the database with that id"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "Unable to get the product details"
                    }
                });
            }

            //VALIDATION PASSED//
            res.json(product)
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },

    
    addProductToCart: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId
            const requestProductId = req.body.productId
            const requestProductInfo = req.body.productInfo
            
            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            const userRecord = await Users.findOne({username:sessionRecord.username})

            //Validation check if the user exists in the database
            if(!userRecord)
            {
                throw Object.assign(new Error("User account cannot be found"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "An error occurred getting orders"
                    }
                });
            }

            //VALIDATION PASSED//
            //Determine if the product already is in the users cart
            let productExists = false
            userRecord.cart.forEach(async (cartItem)=>
            {
                if(cartItem.productId === requestProductId)
                {
                    productExists = true
                }
            })

            //If the product is in the user's cart, increment the quantity
            //Else push a new cart item in the user's cart
            if(productExists)
            {
                await Users.updateOne({_id:userRecord.id, cart:{$elemMatch:{productId:requestProductId}}}, {$inc:{"cart.$.quantity":1}})
            }
            else
            {
                await Users.updateOne({_id:userRecord.id}, {$push:{cart:{productId:requestProductId, title:requestProductInfo.title, productImage:requestProductInfo.productImages[0], price:requestProductInfo.price, quantity:1, priceId:requestProductInfo.priceId}}})
            }                
            
            return res.status(200).send({message:"Added item to cart"}) 
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    writeReview: async (req, res)=>
    {
        try
        {
            const requestFormInfo = req.body.formInfo
            const requestProductId = req.body.productId
            const sessionIdCookie = req.cookies.sessionId
            
            //Validation: Check if the description is not empty
            if(requestFormInfo.description.length === 0)
            {
                throw new Error("The description is empty")
            }

            //Push a review object in the product's review array using the request's information
            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            await Products.updateOne({_id:requestProductId}, {$push:{reviews:{reviewId:token.generateToken(), name:sessionRecord.username, title:requestFormInfo.title, description:requestFormInfo.description}}})
            res.status(200).send({message:"Review submitted"})
        }
        catch(err)
        {
            res.status(500).send({message:"An unexpected error has occurred"})
        }
    }
}