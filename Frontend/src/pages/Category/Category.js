import { useEffect, useRef} from "react"
import CategoryProduct from "../../components/CategoryProduct.js"
import {useSelector, useDispatch} from "react-redux"
import "../../styles/Category/Category.css"
import LoadingGIF from "../../assets/loading.gif"

export default function Category({category, action})
{
    const productObj = useSelector((state)=>state.appInformation[`${category.toLowerCase()}`])
    const productCount = productObj.products.length
    const dispatch = useDispatch()
    const isDataLoading = useRef(false)

    
    //Make a request to get more data 
    async function getData()
    {
        try
        {
            if(isDataLoading.current === false)
            {
                isDataLoading.current = true
    
                const loadMoreButton = document.querySelector("#category-load-more-button")
                loadMoreButton.textContent = "LOADING..."
        
        
                const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/category/${category}`, {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify({totalProducts:productCount})})
                const data = await response.json()
                
                loadMoreButton.textContent = "LOAD MORE"

                if(!response.ok)
                {
                    throw new Error(data.message)
                }
                
                await dispatch(action(data))
                loadMoreButton.textContent = "LOAD MORE"
                isDataLoading.current = false
            }
        }
        catch(err)
        {
            console.log(err)
        }
    }

    //If there's no products invoke getData()
    useEffect(()=>
    {
        if(productCount === 0)
        {
            getData()
        }
    }, [])

    //Generate CategoryProduct components based off the array of objects in the redux state
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

    return (
        <>
            <section id="category-container">
                <h1 id="category-title">{category}</h1>
                {productCount <= 0 && <img id="category-loading" src={LoadingGIF} />}
                {generateComponents()}
                {productObj.maxReached ? "" : <button id="category-load-more-button" onClick={()=>getData()}>LOAD MORE</button>}
            </section>
        </>
    )
}