import "../../styles/Orders/Orders.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import OrderProducts from "../../components/OrderProducts"

export default function Orders()
{
    const [cart, setCart] = useState([])
    const navigate = useNavigate()

    //Request the users orders and place the results in the state
    useEffect(()=>
    {
        async function getOrders()
        {
            try
            {
                const ordersResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/orderHistory`, {credentials:'include'})
                const data = await ordersResponse.json()

                //Validation: Check if the request is successfull
                if(!ordersResponse.ok)
                {
                    throw new Error(ordersResponse.status)
                }

                setCart(data)
            }
            catch(err)
            {
                if(err.message == 401)
                {
                    navigate("/login")
                }
                console.error(err.message)
            }
        }

        getOrders()
    }, [])

    //Based off the cart state generate OrderProducts components
    const orders = cart.map(order => <OrderProducts key={order.id} orderPlaced={order.created} cart={order.cart} address={order.address} />)

    return(
        <section id="orders-main-container">
            <h1 id="orders-history-title">Order history</h1>
            {orders.length !== 0 ? orders : <h1 id="orders-no-items">No previous orders found</h1>}
        </section>
    )
}