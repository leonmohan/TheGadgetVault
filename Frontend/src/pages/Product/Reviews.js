import { useState } from "react"
import "../../styles/Product/Review.css"

export default function Reviews({username, productInfo, reloadPage, productId})
{
    const [formInfo, setFormInfo] = useState({
        title:"",
        description:""
    })

    //Shows the form that allows user to post a review
    function writeReview()
    {
        const reviewForm = document.querySelector("#product-review-form")
        const writeReviewButton = document.querySelector("#product-write-review-button")
        reviewForm.style.display = 'flex'
        writeReviewButton.style.display = "none"
    }

    //Hides the form the allows the user to post a review
    function cancelReview()
    {
        const reviewForm = document.querySelector("#product-review-form")
        const writeReviewButton = document.querySelector("#product-write-review-button")
        writeReviewButton.style.display = "flex"
        reviewForm.style.display = "none"
    }


    //Submits the review to the database and reloads the page
    async function submitReview(e)
    {
        e.preventDefault()

        try
        {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/product/postReview`, {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify({formInfo:formInfo, productId:productId}), credentials:"include"})
            
            //Validation: Check if the request is successfull
            if(!response.ok)
            {
                throw new Error("Failed to post review")
            }
            
            cancelReview()
            reloadPage()
        }
        catch(err)
        {
            console.log(err)
        }
    }

    //Change the form state if the user writes something in the inputs
    function handleChange(event)
    {
        const inputName = event.target.name
        const value = event.target.value

        setFormInfo((oldDetails)=>{return {...oldDetails, ...{[inputName]:value}} } )
    }

    //Generate components based off the reviews given by productInfo props
    function loadReviews()
    {
        const reviews = productInfo.reviews.map(review => (
            <div key={review.reviewId} className="product-review">
                    <h5 className="product-review-name">{review.name}</h5>
                    <span className="product-review-title">{review.title}</span>
                    <p className="product-review-description">{review.description}</p>
            </div>
        ))

        return reviews
    }

    return(
        <section id="product-reviews-container">
            {productInfo.reviews && <h4 id="product-review-header">Customer Reviews</h4>}
            {username && <button id="product-write-review-button" onClick={writeReview}>Write a review</button>}
            
            <form id="product-review-form" onSubmit={submitReview}>
                <p id="product-form-username">Name: <span>{username}</span></p>
                <input type="text" name="title" placeholder="title" value={formInfo.title} onChange={handleChange} id="product-review-form-title" />
                <textarea placeholder="description" name="description" value={formInfo.description} onChange={handleChange} id="product-review-form-desc" />
                <button id="product-review-form-submit">Submit review</button>
                <button id="product-review-form-cancel" type="button" onClick={cancelReview}>Cancel</button>
            </form>

            {productInfo.reviews && loadReviews()}
        </section>
    )
}