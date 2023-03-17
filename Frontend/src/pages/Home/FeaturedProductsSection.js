import FeaturedProduct from "../../components/Home/FeaturedProduct"
import { useEffect, useState } from "react"
import "../../styles/Home/FeaturedProductSection.css"

export default function FeaturedProductsSection({products})
{
    const [featuredProducts, setFeaturedProducts] = useState({featuredProducts:[], featuredProductsMobile:[]})

    //Creates a div with exactly two components and stores that in the featuredProduct's state for both mobile and computer
    useEffect(()=>
    {
        try
        {
            //For every two products store an array of two product objects. Eg: [[{}, {}], [{}, {}], [{}, {}]]
            let processedData = []
            let tempArr = []

            for(let i=0; i<=products.length; i++)
            {
                if(tempArr.length === 2)
                {
                    processedData.push(tempArr)
                    tempArr = []
                    tempArr.push(products[i])
                }
                else
                {
                    tempArr.push(products[i])
                }
            }

            //Generate components based off the processed array of objects
            const productComponents = processedData.map(productArr=>
            {
                return(
                    <div key={Math.random()} className="home-featured-products-container">
                        {productArr.map(productObj=>{
                            return(
                                <FeaturedProduct key={productObj._id} productInfo={productObj} />
                            )
                        })}
                    </div>
                )
            })

            const productComponentsMobile = products.map(productObj => {
                return(
                    <FeaturedProduct key={productObj._id} productInfo={productObj} />
                )
            })

            //Place the generated components in the state
            setFeaturedProducts(()=>({featuredProductsMobile:productComponentsMobile, featuredProducts:productComponents}))
        }
        catch(err)
        {
            console.log(err.message)
        }
    }, [])

    return(
        <>
            <section id="home-featured-products-main-container">
                <h3>Featured products</h3>
                {featuredProducts.featuredProducts}
            </section>


            <section id="home-featured-products-main-container-mobile">
                <h3>Featured products</h3>

                <div id="home-featured-products-products">
                    {featuredProducts.featuredProductsMobile}
                </div>
            </section>
        </>
    )
}
