import { useEffect, useState } from "react"
import "../../styles/Cart/Cart.css"
import CartItem from "../../components/CartItem"
import LoadingGIF from "../../assets/loading.gif"
import {useNavigate, Link} from "react-router-dom"

export default function Cart()
{
    const [userInfo, setUserInfo] = useState({address:"", cart:[]})

    const navigate = useNavigate()

    function displayCartLoading(isLoading)
    {
        const loadingContainer = document.querySelector("#cart-loading-container")
        loadingContainer.style.display = isLoading ? 'flex' : 'none'
    }

    async function getCart()
    {
        try
        {
            displayCartLoading(true)

            const accountResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/getAccount`, {method:"GET", credentials:"include"})
            const data = await accountResponse.json()

            //Validation: Check if the request was successfull
            if(!accountResponse.ok)
            {
                if(accountResponse.status === 401)
                {
                    navigate("/login")
                }
                else
                {
                    throw new Error("Could not get cart")
                }
            }

            const address = await data.address
            const cartData = await data.cart
            setUserInfo({address:address, cart:cartData})

            displayCartLoading(false)

        }
        catch(err)
        {
            console.log("Could not get cart")
        }
    }

    //When the page is loaded for the first time, invoke getCart()
    useEffect(()=>
    {
        getCart()
    }, [])

    //Convert the cart array of objects into CartItem components
    const cartComponents = userInfo.cart.map((cartItem)=><CartItem key={cartItem.productId} cartItem={cartItem} getCart={getCart} />)


    //Get the sum of all the price properties from the objects in userInfo.cart 
    function getTotal()
    {
        let total = 0

        for(let item of userInfo.cart)
        {
            total += (item.price*item.quantity)
        }

        return total.toFixed(2)
    }

    async function handleCheckout()
    {
        try
        {
            const paymentResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/checkout`, {method:"POST", headers:{'Content-Type':'application/json', 'Accept':'application/json'}, credentials:"include"})
            const paymentData = await paymentResponse.json()


            //Validation: Check if the request was successfull
            if(!paymentResponse.ok)
            {
                throw new Error("Payment failed")
            }

            window.location.href = paymentData.url
        }
        catch(err)
        {
            console.error(err.message)
        }
    }

    return (
        <>
        <section id="cart-main-container">
            <div id="cart-products-container">
                <h1 id="cart-page-title">Your Cart</h1>
                {(userInfo.address.length !== 0 && userInfo.cart.length > 0) && <p>{`Address: ${userInfo.address}`}</p>}
                <div id="cart-loading-container">
                    <img id="cart-loading" src={LoadingGIF} />
                </div>
                {cartComponents}
            </div>

            {userInfo.cart.length > 0 && (
                <div id="cart-checkout">
                    <p>{`Total: $${getTotal()}`}</p>
                    {userInfo.address.length !== 0 ? <button id="cart-checkout-button" onClick={handleCheckout}>Checkout</button> : <Link id="cart-address-validation" to="/account"><span>Click here to enter address</span></Link>}
                </div>   
            )}
        </section>
        
        {userInfo.cart.length <= 0 && <h1 id="cart-empty-cart-warning">Your cart is empty</h1>}
        </>
    )
}