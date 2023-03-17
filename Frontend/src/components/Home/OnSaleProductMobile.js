import {Link} from "react-router-dom"

export default function OnSaleProductMobile({products})
{
    return (
    <div id="home-onsale-products-mobile">
        {products}
        <Link id="home-onsale-products-slideshow-see-more-mobile" to="onsale">See more</Link>
    </div>
    )
}