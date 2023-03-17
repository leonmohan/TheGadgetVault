import "../styles/Cart/CartItem.css"

export default function CartItem({cartItem, getCart})
{
    async function handleDelete()
    {
        try
        {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/deleteFromCart`, {method:"DELETE", headers:{'Content-Type':'application/json'}, body:JSON.stringify({productId:cartItem.productId}), credentials:"include"})
            
            //Validation: Check if the response has any errors
            if(!response.ok)
            {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }
            
            //VALIDATION PASSED//
            //Refresh cart
            getCart()
        }
        catch(err)
        {
            console.log(err)
        }
    }

    async function quantityOnChange(event)
    {
        try
        {
            const productId = cartItem.productId
            let newQuantity = event.target.value

            //Validation: Remove any special characters that aren't a number
            event.target.value = newQuantity.replace(/[^0-9]/g, "")

            //Validation: Only send an API request if the input has a number.
            if(newQuantity !== "")
            {
                const quantityResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/updateQuantity`, {method:"PUT", headers:{'Content-Type':'application/json'}, body:JSON.stringify({quantity:newQuantity, productId:productId}), credentials:"include"})
                
                //Validation: Check if the request was successfull. If it's not, refresh the cart.
                if(!quantityResponse.ok)
                {
                    throw new Error("Failed to update the quantity")
                }
                
                getCart()
            }
        }
        catch(err)
        {
            console.error(err)
            getCart()
        }
    }

    return(
        <div className="cart-product">
            <img src={cartItem.productImage} className="cart-product-image" />
            <div className="cart-product-info">
                <h3 className="cart-product-title">{cartItem.title}</h3>
                <div className="cart-product-options">
                    <input className="cart-product-quantity" type="text" placeholder="quantity" defaultValue={cartItem.quantity} onInput={quantityOnChange} />
                    <button className="cart-product-delete" onClick={handleDelete}>Remove</button>
                </div>
            </div>
            <span className="cart-product-price">{`$${cartItem.price}`}</span>
        </div>
    )
}