const db = require("../config/db")
const Users = require("../models/Users")
const Sessions = require("../models/Sessions")
const Orders = require("../models/Orders")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


module.exports = 
{
    deleteFromCart: async (req, res)=>
    {
        try
        {
            const requestProductId = req.body.productId
            const sessionIdCookie = req.cookies.sessionId

            //Pull the object from the users cart that has the request's productId 
            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            await Users.updateOne({username:sessionRecord.username}, {$pull:{cart:{productId:requestProductId}}})

            res.status(200).send({message:"Removed item from cart"})
        }
        catch(err)
        {
            res.status(500).send({message:"An unexpected error has occurred"})
        }
    },


    updateQuantity: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId
            const requestProductId = req.body.productId
            const requestQuantity = req.body.quantity
            
            let newQuantity = requestQuantity.replace(/[^0-9]/g, '')

            //Validation: Check if the quantity is not empty (undefined, null)
            if(!newQuantity)
            {
                throw Object.assign(new Error("Invalid quantity amount entered"), 
                { 
                    data: 
                    {
                        errorCode: 400,
                        errorMessage: "Invalid quantity amount entered"
                    }
                });
            }

            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            const userRecord = await Users.findOne({username:sessionRecord.username})

            //Validation: Check if the product is in the user's cart exists from the database
            let productExists = false
            userRecord.cart.forEach(async (cartItem)=>
            {
                if(cartItem.productId === requestProductId)
                {
                    productExists = true
                }
            })
            if(!productExists)
            {
                throw Object.assign(new Error("Product cannot be found in user's cart"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "The item does not exist in this account"
                    }
                });
            }

            //VALIDATIONS PASSED//
            //If the client is requests a number less than 1, delete the product from the cart
            //Else update the object to whatever quantity the client is requesting
            if(newQuantity < 1)
            {
                await Users.updateOne({_id:userRecord.id}, {$pull:{cart:{productId:requestProductId}}})
            }
            else
            {
                await Users.updateOne({_id:userRecord.id, cart:{$elemMatch:{productId:requestProductId}}}, {$set:{"cart.$.quantity":Number(newQuantity)}})
            }
            
            res.status(200).send({message:"Quantity updated"}) 
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    checkout: async (req, res) =>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId

            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            const userRecord = await Users.findOne({username:sessionRecord.username})

            //Validation: Check if a user record exists and check if the user record has an address
            if(!userRecord || !userRecord.address.length === 0)
            {
                throw Object.assign(new Error("The users record or address could not be found"), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "Failed to make payment"
                    }
                });
            }

            //VALIDATIONS PASSED//
            const lineItems = userRecord.cart.map(item => {return {price:item.priceId, quantity:item.quantity}})

            const session = await stripe.checkout.sessions.create({
                line_items:lineItems,
                mode:'payment',
                customer_email:userRecord.email,
                success_url:`${process.env.BACKEND_URL}`,
                cancel_url:`${process.env.FRONTEND_URL}/cart`,
                metadata: {
                    username: userRecord.username
                }
            })

            res.json({url:session.url})
        }
        catch(err)
        {
            console.log(err.message)
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },

    //Webhook
    stripeCheckoutSuccess: async (req, res) => 
    {
        const sig = req.headers['stripe-signature'];

        let event;
      
        try
        {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) 
        {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
      
   
        if(event.type === 'checkout.session.completed')
        {
            const checkoutSessionCompleted = event.data.object;
            const metadataUsername = checkoutSessionCompleted.metadata.username
         
            try
            {
                const userRecord = await Users.findOne({username:metadataUsername})
                await Orders.create({cart:userRecord.cart, username:metadataUsername, created:new Date().toUTCString(), address:userRecord.address})
                await Users.updateOne({username:metadataUsername}, {$set:{cart:[]}})
            }
            catch(err)
            {
                res.status(500).send({message:"Could not insert order into the users history"})
            }
        }

        res.send();
    }
}