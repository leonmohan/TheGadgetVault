import {Link} from "react-router-dom"
import "../../styles/componenets/Home/OnSaleProduct.css"

export default function OnSaleProduct(props)
{
    const {title, reviews, price, productImages, _id} = props.productInfo

    return(
        <Link className='home-onsale-product' to={`/product/${_id}`}>
            <img className="home-onsale-product-image" src={productImages[0]} />
            <p className="home-onsale-product-title">{title}</p>
            <span className="home-onsale-product-reviews">{reviews.length} Reviews</span>
            <span className="home-onsale-product-price">{`$${price}`}</span>
        </Link>
    )
}