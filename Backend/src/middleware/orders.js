const db = require("../config/db")
const Sessions = require("../models/Sessions")
const Orders = require("../models/Orders")

module.exports = 
{
    getOrders: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId
            
            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            const userOrders = await Orders.find({username:sessionRecord.username})

            res.json(userOrders)
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    }
}