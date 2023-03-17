import "../../styles/Home/HomeSlideshow.css"
import {Link} from "react-router-dom"
import {useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronRight, faChevronLeft} from "@fortawesome/free-solid-svg-icons"

import SurvivalParacordAd from "../../assets/survival-paracord-ad.jpg"
import DummySecurityLight from "../../assets/dummy-security-light-ad.jpg"
import BluetoothBeanie from "../../assets/bluetooth-beanie-ad.jpg"
import ElectricFoodChopper from "../../assets/electric-food-chopper-ad.jpg"

export default function HomeSlideshow({doneLoading})
{
    const [slideShowSettings, setSlideshowSettings] = useState({
        slideIndex:1,
        lastClicked:0
    })

    //If the boolean from the props is true
    //create an interval that will invoke the updateSlide function every 10 seconds
    const slideshowInterval = doneLoading ? setInterval(()=>{
        if(0.001*Date.now()-slideShowSettings.lastClicked > 10)
        {
            updateSlide("automatic")
        }
    }, 10000) : ""


    function makeSlideActive(isActive, slide)
    {
        slide.style.zIndex = isActive ? 1 : 0
        slide.style.top = isActive ? 0 : 0
        slide.style.opacity = isActive ? 1 : 0
        slide.style.position = isActive ? "relative" : "absolute"
    }

    //Update the slide depending on the action argument
    function updateSlide(action)
    {
        clearInterval(slideshowInterval)

        switch(action)
        {
            case "backward":
                setSlideshowSettings((oldSlideshow)=>
                {
                    return(
                    {
                        slideIndex: oldSlideshow.slideIndex === 1 ? 4 : oldSlideshow.slideIndex-1,
                        lastClicked:0.001*Date.now()
                    })
                })
                break;
            case "forward":
                setSlideshowSettings((oldSlideshow)=>
                {
                    return(
                    {
                        slideIndex:oldSlideshow.slideIndex === 4 ? 1 : oldSlideshow.slideIndex+1,
                        lastClicked:0.001*Date.now()
                    })
                })
                break;
            case "automatic":
                setSlideshowSettings((oldSlideshow)=>
                {
                    return(
                    {
                        ...oldSlideshow,
                        slideIndex:oldSlideshow.slideIndex === 4 ? 1 : oldSlideshow.slideIndex+1
                    })
                })
                break;
            default:
                setSlideshowSettings(()=>
                {
                    return(
                    {
                        slideIndex:action,
                        lastClicked:0.001*Date.now()
                    })
                })
                break;
        }
    }


    //Everytime the slideShowSettings state is updated change the slideshow's display
    useEffect(()=>{
        try
        {
            const slides = document.querySelectorAll(".home-slide img")
            const buttons = document.querySelectorAll(".home-slide-button")
    

            //Make all the slides inactive
            slides.forEach(slide => 
            {
                slide.classList.remove("home-slide-active-animation")
                makeSlideActive(false, slide)
            })
    
            //Make the slide with the index from the state active
            const activeSlide = document.querySelector(`#home-slide-${slideShowSettings.slideIndex} img`)
            activeSlide.classList.add("home-slide-active-animation")
            makeSlideActive(true, activeSlide)
    

            //Makes all the buttons inactive
            buttons.forEach(button => 
            {
                    button.classList.remove("home-button-active")
            })

            //Gets the specific button that's active and sets its class to make it active
            const activeButton = document.querySelector(`#home-slide-button-${slideShowSettings.slideIndex}`)
            activeButton.classList.add("home-button-active")
        }
        catch
        {
            return window.location.reload()
        }
    }, [slideShowSettings])

    return(
        <>
            <section id="home-slideshow-container">
                <ul id="home-slides">
                    <li className="home-slide" id="home-slide-1"><Link to="/product/63ea5bdc1394b9002179653b"><img style={{zIndex:1, position:'relative', display:'block', width:'100%', top: 0, opacity:1}} src={SurvivalParacordAd} /></Link></li>
                    <li className="home-slide" id="home-slide-2"><Link to="/product/63e9b84b29caf62e0e959f87"><img style={{zIndex:0, position:'absolute', display:'block', width:'100%', top: 0, opacity:0}} src={DummySecurityLight} /></Link></li>
                    <li className="home-slide" id="home-slide-3"><Link to="/product/63e9e95372de0aebf774c3a0"><img style={{zIndex:0, position:'absolute', display:'block', width:'100%', top: 0, opacity:0}} src={BluetoothBeanie} /></Link></li>
                    <li className="home-slide" id="home-slide-4"><Link to="/product/63ea574b1394b90021796533"><img style={{zIndex:0, position:'absolute', display:'block', width:'100%', top: 0, opacity:0}} src={ElectricFoodChopper} /></Link></li>
                </ul>

                <div id="home-slides-nav">
                    <span id="home-slides-nav-backward" onClick={()=>{updateSlide("backward")}}><FontAwesomeIcon icon={faChevronLeft} /></span>
                    <ol id="home-slides-nav-buttons">
                        <li className="home-slide-button" id="home-slide-button-1" onClick={()=>updateSlide(1)}></li>
                        <li className="home-slide-button" id="home-slide-button-2" onClick={()=>updateSlide(2)}></li>
                        <li className="home-slide-button" id="home-slide-button-3" onClick={()=>updateSlide(3)}></li>
                        <li className="home-slide-button" id="home-slide-button-4" onClick={()=>updateSlide(4)}></li>
                    </ol>
                    <span id="home-slides-nav-forward" onClick={()=>updateSlide("forward")}><FontAwesomeIcon icon={faChevronRight} /></span>
                </div>
            </section>
        </>
    )
}