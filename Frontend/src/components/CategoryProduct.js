import React from "react"
import {Link} from "react-router-dom"

export default function CategoryProduct(props)
{
    const {_id, productImages, title, reviews, price} = props.productInfo

    return (
        <Link to={`/product/${_id}`} key={_id} className="category-product">
            <img className="category-product-img" src={productImages[0]} />
            <h4 className="category-product-title">{title}</h4>
            <span className="category-product-reviews">{reviews.length} Reviews</span>
            <span className="category-product-reviews">{`$${price}`}</span>
        </Link>
    )
}