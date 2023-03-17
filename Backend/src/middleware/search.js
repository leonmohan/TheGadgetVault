const db = require("../config/db")
const Products = require("../models/Products")

module.exports = 
{
    searchProducts: async (req, res)=>
    {
        try
        {
            //Create a regex pattern with the requests searchText on all the products in the database
            const searchText = req.params.searchText
            const regex = new RegExp(searchText, "i");
            
            await db()
            const products = await Products.find({ title: { $regex: regex} },{ _id: 1, title: 1 }).limit(20)
            
            await res.json(products)
        }
        catch
        {
            res.status(404).send("Failed to search products")
        }
    }
}