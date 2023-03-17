const express = require("express")
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')


require('dotenv').config()
app.use(cors({origin:[process.env.FRONTEND_URL, "https://checkout.stripe.com"], credentials: true}));
app.use((req, res, next) =>
{
    if(req.originalUrl === "/checkoutSuccess")
    {
        express.raw({type:'application/json'})(req, res, next)
    }
    else
    {
        bodyParser.json()(req, res, next)
    }
});
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


const homeRoutes = require("./routes/home")
const productRoutes = require("./routes/product")
const accountRoutes = require("./routes/account")
const categoryRoutes = require("./routes/category")
const searchRoutes = require("./routes/search")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/orders")


app.use(homeRoutes)
app.use(productRoutes)
app.use(accountRoutes)
app.use(categoryRoutes)
app.use(searchRoutes)
app.use(cartRoutes)
app.use(orderRoutes)


app.listen(process.env.PORT)