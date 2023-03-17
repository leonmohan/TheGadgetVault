import "../../styles/Home/Home.css"
import HomeSlideshow from "./HomeSlideshow"
import FeaturedProductsSection from "./FeaturedProductsSection"
import OnSaleProductSlideshow from "./OnSaleProductSlideshow.js"
import BenefitsSection from "./BenefitsSection"
import { useEffect, useState } from "react"
import LoadingSection from "../../assets/loading.gif"

export default function Home()
{
    const [products, setProducts] = useState({featuredProducts:[], onsaleProducts:[]})

    //Gets all the products that need to be displayed on home and stores it in the state
    useEffect(()=>
    {
        async function getHomeProducts()
        {
            try
            {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/homeDisplayProducts`)
                const data = await response.json()

                if(!response.ok)
                {
                    throw new Error(data.message)
                }
                setProducts(data)
            }
            catch(err)
            {
                console.log(err)
            }
        }

        getHomeProducts()
    }, [])


    return(
        <>
            <HomeSlideshow doneLoading={products.featuredProducts.length > 0 && products.onsaleProducts.length > 0} />
            {products.featuredProducts.length > 0 ? <FeaturedProductsSection products={products.featuredProducts} /> : <div id="featured-products-loading"><img src={LoadingSection} /></div> }
            {products.onsaleProducts.length > 0 ? <OnSaleProductSlideshow products={products.onsaleProducts} /> : <div id="onsale-products-loading"><img src={LoadingSection} /></div> }
            <BenefitsSection />
        </>
    )
}