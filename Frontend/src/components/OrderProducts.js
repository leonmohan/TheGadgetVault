export default function OrderProducts({orderPlaced, cart, address})
{
    //Convert all the data from the cart prop into a component
    const cartItems = cart.map(order => (
        <div className="order-product">
            <img src={order.productImage} />
            <p>{order.title}</p>
        </div>
    ))

    //Get the sum of all the cart object's price
    function getTotal()
    {
        let total = 0

        for(let item of cart)
        {
            total += item.price
        }

        return total.toFixed(2)
    }

    //Remove the time from the UTC time string so it can only show the date
    function convertDate()
    {
        return new Date(orderPlaced).toDateString()
    }

    return(
        <div className="order-container">
            <p>{`Order placed: ${convertDate()}`}</p>
            <p>{address}</p>
            <p>{`Paid: $${getTotal()}`}</p>
            <div className="order-products">
                {cartItems}
            </div>
        </div>
    )
}