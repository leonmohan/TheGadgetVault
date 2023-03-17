import "../../styles/Product/Product.css"
import { useEffect, useState } from "react"
import {useParams, useNavigate} from "react-router-dom"
import LoadingGIF from "../../assets/loading.gif"
import FormLoadingGIF from "../../components/FormLoadingGIF"
import Reviews from "./Reviews"

export default function Product()
{
    const {productId} = useParams()
    const [productPageDetails, setProductPageDetails] = useState({
        productInfo:{},
        selectedPicture:0,
        username:undefined
    })
    const navigate = useNavigate()
    const {productInfo, selectedPicture, username} = productPageDetails

    //Displays loading icons
    function displayFormLoading(isLoading)
    {
        const loadingIcon = document.querySelector("#form-loading")
        loadingIcon.style.display = isLoading ? "flex" : "none"
    }

    function displayPageLoading(isLoading)
    {
        const pageLoading = document.querySelector("#loading-gif")
        const containerContent = document.querySelector("#product-info-container")
        const reviewsContainer = document.querySelector("#product-reviews-container")

        reviewsContainer.style.display = isLoading ? "none" : "block"
        pageLoading.style.display = isLoading ? "flex" : "none"
        containerContent.style.display = isLoading ? "none" : "flex"
    }

    //Makes a request
    async function getProductData()
    {
        try
        {
            displayPageLoading(true)

            const productResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/product/${productId}`)
            const productData = await productResponse.json()

            const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/getAccount`, {method:"GET", credentials:"include"})
            const userData = await userResponse.json()
            
            //Validation: Check if the requests were successfull
            if(!productResponse.ok)
            {
                throw new Error(JSON.stringify({status:productResponse.status, message:productData.message}))
            }

            displayPageLoading(false)
            //Spreads the new data with the old data
            setProductPageDetails((oldDetails)=>{return {...oldDetails, ...{productInfo:productData, selectedPicture:0, username:userResponse.status !== 401 ? userData.username : undefined} }})   
        }
        catch(err)
        {
            if(JSON.parse(err.message).status === 400 || JSON.parse(err.message).status === 404)
            {
                navigate("error")
            }
        }
    }

    //When the productId changes, get the new product
    useEffect(()=>{
        getProductData()
    }, [productId])


    //Attempts to add product to the users cart. A validation message will then appear with the results
    async function addToCart()
    {
        const responseMessage = document.querySelector("#product-add-cart-result")

        try
        {
            responseMessage.textContent = ""
            displayFormLoading(true)

            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/product/addCart`, {method:"PUT", headers:{'Content-Type':'application/json'}, body:JSON.stringify({productId:productId, productInfo:productInfo}), credentials:"include"})

            //Validation: Check if the request was successfull
            if(!response.ok)
            {
                throw new Error("Failed to add to cart")
            }

            displayFormLoading(false)
            responseMessage.style.color = "green"
            responseMessage.textContent = "Added to cart"
        }
        catch(err)
        {
            displayFormLoading(false)
            responseMessage.style.color = "red"
            responseMessage.textContent = "Failed to add to cart"
        } 
    }

    return(
        <section id="product-main-container">
            <img src={LoadingGIF} id="loading-gif"/>
            <section id="product-info-container">
                {productInfo.productImages && <img id="product-main-img" src={productInfo.productImages[selectedPicture]} />}
                <div id="product-images-container">
                    {productInfo.productImages && productInfo.productImages.map((image, idx) => <img key={image} className={idx===selectedPicture ? "product-image-selected" : "product-image"} src={image} draggable={false} onClick={()=>setProductPageDetails((oldDetails)=>{return {...oldDetails, ...{selectedPicture:idx}}})} /> )}
                </div>

                <div id="product-text-information-container">
                    <h3 id="product-text-title">{productInfo.title}</h3>
                    {productInfo.reviews && <p id="product-text-review-count">{`${productInfo.reviews.length} Reviews`}</p>}
                    {productInfo.price && <p id="product-text-price">{`$${productInfo.price}`}</p>}
                    {productInfo.description && <p id="product-text-description">{productInfo.description}</p>}
                    <div id="product-validations-container">
                        <span id="product-add-cart-result"/>
                        <FormLoadingGIF />
                    </div>
                    {productPageDetails.username && <button id="product-add-cart-button" onClick={addToCart}>Add to cart</button>}
                </div>
            </section>

            <Reviews username={username} productInfo={productPageDetails.productInfo} reloadPage={getProductData} productId={productId} />
        </section>
    )
    
}