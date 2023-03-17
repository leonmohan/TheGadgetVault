const db = require("../config/db")
const Products = require("../models/Products")

module.exports = 
{
    getHomeDisplay: async function(req, res)
    {
        try
        {
            await db()
            const featuredProducts = await Products.find({featured:true}).limit(6)
            const onsaleProducts = await Products.find({onsale:true}).limit(12)

            //Validation: Check if the home page's products are returned
            if(featuredProducts.length === 0 || onsaleProducts.length === 0)
            {
                throw Object.assign(new Error("Home products not found"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "An error occurred getting products"
                    }
                });
            }

            //VALIDATION PASSED//
            const homeProducts = {featuredProducts:featuredProducts, onsaleProducts:onsaleProducts}
            res.json(homeProducts)
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    }
}