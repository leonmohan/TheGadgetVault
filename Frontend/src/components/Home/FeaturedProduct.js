import {Link} from "react-router-dom"

export default function FeaturedProduct(props)
{
    const {_id, productImages, title, reviews, price} = props.productInfo

    return(
        <Link to={`product/${_id}`} className="home-featured-product">
            <img className="home-featured-product-image" src={productImages[0]} />
            <h4 className="home-featured-product-title">{title}</h4>
            <span className="home-featured-product-reviews">{reviews.length} Reviews</span>
            <span className="home-featured-product-price">{`$${price}`}</span>
        </Link>
    )
}