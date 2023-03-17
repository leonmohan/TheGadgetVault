const db = require("../config/db")
const Products = require("../models/Products")

module.exports = 
{
    getCategory: async (req, res)=>
    {
        try
        {
            const categoryParameter = req.params.category
            const skipRowLength = req.body.totalProducts
            const cleanedParameter = categoryParameter.charAt(0).toUpperCase() + categoryParameter.slice(1).toLowerCase()
            
            await db()
            const products = await Products.find({category:cleanedParameter}).skip(skipRowLength).limit(12)

            //Validation: Check if any products were returned
            if(products.length === 0)
            {
                throw Object.assign(new Error("Products not found"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "An error occurred getting products"
                    }
                });
            }

            //VALIDATION PASSED//
            res.json({products:products.slice(0,6), maxReached:products.slice(6).length === 0})
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    getOnsale: async (req, res)=>
    {
        try
        {
            await db()
            const skipRowLength = req.body.totalProducts
            const products = await Products.find({onsale:true}).skip(skipRowLength).limit(12)

            //Validation: Check if any products were returned
            if(products.length === 0)
            {
                throw Object.assign(new Error("Products not found"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "An error occurred getting products"
                    }
                });
            }

            //VALIDATION PASSED//
            res.json({products:products.slice(0,6), maxReached:products.slice(6).length === 0})
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    }
}