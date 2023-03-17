import OnSaleProduct from "../../components/Home/OnSaleProduct.js"
import OnSaleProductMobile from "../../components/Home/OnSaleProductMobile"
import "../../styles/Home/OnSaleProductSlideshow.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleChevronRight, faCircleChevronLeft, faCircle} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import {gsap} from "gsap"
import {Link} from "react-router-dom"

export default function OnSaleProductSlideshow({products})
{
    const [slide, setSlide] = useState(1)
    const [onSaleProducts, setOnSaleProducts] = useState([])

    //Slideshow logic
    useEffect(()=>
    {
        const slidePixelX = {1:0, 2:-694, 3:-1380, 4:-2070}
        const buttons = document.querySelectorAll(".home-onsale-products-slideshow-button")

        //Remove each buttons active class. 
        //If a button with the desired id matches (based off the active slide) set that buttons class to active
        buttons.forEach((button)=>
        {
            button.classList.remove("home-onsale-products-slideshow-button-active")
            button.id === `home-onsale-products-slideshow-button-${slide}` && button.classList.add("home-onsale-products-slideshow-button-active")
        })

        //Use gsap to navigate to the active slide
        gsap.to(".home-onsale-products-slideshow", {duration: 1, x:`${slidePixelX[slide]}px`})
    }, [slide])


    //Change the active slide to depending on the action argument
    function changeSlide(action)
    {
        switch(action)
        {
            case "forwards":
                setSlide((oldSlide)=> oldSlide === 1 ? 4 : oldSlide-1)
                break;
            case "backwards":
                setSlide((oldSlide)=> oldSlide === 4 ? 1 : oldSlide+1)
                break;
            default:
                setSlide(action)
                break;
        }
    }


    //Render products logic
    useEffect(()=>{
        try
        {
            const onSaleProducts = products.map((productData) => <OnSaleProduct key={productData._id} productInfo={productData} />)
            setOnSaleProducts(onSaleProducts)
        }
        catch(err)
        {
            console.log(err)
        }
    }, [])


    return(
        <>
            <section id="home-onsale-products-container">
                <h3 id="home-onsale-products-content">ON SALE</h3>

                <div id="home-onsale-products-slideshow-container">
                    <div id="home-onsale-products-slideshow-nav-container">
                        <div id="home-onsale-products-slideshow-nav">
                            <FontAwesomeIcon className="home-onsale-products-slideshow-nav-forward" icon={faCircleChevronLeft} onClick={()=>changeSlide("forwards")} />
                            <FontAwesomeIcon className="home-onsale-products-slideshow-nav-backward" icon={faCircleChevronRight} onClick={()=>changeSlide("backwards")}/>
                            <div className="home-onsale-products-slideshow-buttons">
                                <FontAwesomeIcon className="home-onsale-products-slideshow-button" id="home-onsale-products-slideshow-button-1" icon={faCircle} onClick={()=>{changeSlide(1)}}/>
                                <FontAwesomeIcon className="home-onsale-products-slideshow-button" id="home-onsale-products-slideshow-button-2" icon={faCircle} onClick={()=>changeSlide(2)}/>
                                <FontAwesomeIcon className="home-onsale-products-slideshow-button" id="home-onsale-products-slideshow-button-3" icon={faCircle} onClick={()=>changeSlide(3)}/>
                                <FontAwesomeIcon className="home-onsale-products-slideshow-button" id="home-onsale-products-slideshow-button-4" icon={faCircle} onClick={()=>changeSlide(4)}/>
                                <Link id="home-onsale-products-slideshow-see-more" to="onsale">See more</Link>
                            </div>
                        </div>

                        <div className="home-onsale-products-slideshow">
                            {onSaleProducts}
                        </div>
                    </div>
                </div>
            </section>


            <section id="home-onsale-products-container-mobile">
                <h3>On Sale</h3>
                <OnSaleProductMobile products={onSaleProducts} />
            </section>
        </>
    )
}