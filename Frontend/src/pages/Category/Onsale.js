import Category from "./Category";
import {updateOnsale} from "../../slices/appInformation"
import { useEffect} from "react"
import CategoryProduct from "../../components/CategoryProduct.js"
import {useSelector, useDispatch} from "react-redux"
import "../../styles/Category/Category.css"
import LoadingGIF from "../../assets/loading.gif"

export default function Onsale()
{
    const productObj = useSelector((state)=>state.appInformation.onsale)
    const productCount = productObj.products.length
    const dispatch = useDispatch()

    useEffect(()=>
    {
        if(productCount === 0)
        {
            getData()
        }
    }, [])

    function generateComponents()
    {
        const categoryProducts = productObj.products.map((prod)=>
        {
            return <CategoryProduct key={prod._id} productInfo={prod} />
        })

        let sectionContainer = []
        const newProducts = []

        categoryProducts.forEach((product, idx)=>
        {
            sectionContainer.push(product)
    
            if(sectionContainer.length === 3 || idx+1 === productCount)
            {
                newProducts.push(<section key={Math.random()} className="category-products-container">{sectionContainer}</section>)
                sectionContainer = []
            }
        })

        return newProducts
    }

    
    async function getData()
    {
        const loadMoreButton = document.querySelector("#category-load-more-button")
        loadMoreButton.textContent = "LOADING..."


        const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/onsale`, {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify({totalProducts:productCount})})
        const data = await response.json()
        dispatch(updateOnsale(data))
        loadMoreButton.textContent = "LOAD MORE"
    }

    return (
        <>
            <section id="category-container">
                <h1 id="category-title">Onsale</h1>
                {productCount <= 0 && <img id="category-loading" src={LoadingGIF} />}
                {generateComponents()}
                {productObj.maxReached ? "" : <button id="category-load-more-button" onClick={()=>getData()}>LOAD MORE</button>}
            </section>
        </>
    )
}