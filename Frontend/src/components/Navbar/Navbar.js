import "../../styles/Navbar/Navbar.css"
import Search from "../Navbar/Search.js"
import {Link, Outlet, useLocation} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faMagnifyingGlass, faCartShopping, faUser, faBars} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import FullLogo from "../../assets/full-logo.png"

export default function Navbar()
{
    const [searchEnabled, setSearchEnabled] = useState(false)
    const {pathname} = useLocation()

    function handleSearchBar(setEnabled)
    {
        setSearchEnabled(setEnabled)
    }


    //COMPUTER
    function generateLinks()
    {
        const linkInformation = 
        [
            {path:"/vehicle", text:"Vehicle"},
            {path:"/computer", text:"Computer"},
            {path:"/security", text:"Security"},
            {path:"/apparel", text:"Apparel"},
            {path:"/cooking", text:"Cooking"},
            {path:"/outdoor", text:"Outdoor"}
        ]
        const links = linkInformation.map((link, idx) => 
        {
            return link.path === pathname ? <li key={idx}><Link to={link.path} className="nav-link-active"><span>{link.text}</span></Link></li> : <li key={idx}><Link to={link.path} className="nav-link"><span>{link.text}</span></Link></li>
        })

        return links
    }

    useEffect(()=>
    {
        const navbar = document.querySelector("#nav")

        //Set an event listner that will check if the user has scrolled.
        window.addEventListener("scroll", ()=>
        {
            //If the user has scrolled, past 0 change the class of the navbar to scroll (which will provide a background color)
            //Else make the navbar background transparent
            navbar.className = window.scrollY === 0 ? "nav-top" : "nav-scroll"
        })
    }, [])


    //MOBILE
    function handleMobileLinkClick()
    {
        const mobileNavbarHyperlinks = document.querySelector("#nav-list-mobile-hyperlinks")
        const mobileNavbar = document.querySelector("#nav-list-mobile")

        mobileNavbarHyperlinks.className = "nav-list-mobile-hyperlinks-inactive"
        mobileNavbar.style.height = '0'
        document.body.style.overflow = "auto"
    }

    function handleMobileBarClick()
    {
        const mobileNavbarHyperlinks = document.querySelector("#nav-list-mobile-hyperlinks")
        const mobileNavbar = document.querySelector("#nav-list-mobile")
            
        mobileNavbarHyperlinks.className = mobileNavbarHyperlinks.className === "nav-list-mobile-hyperlinks-inactive" ? "nav-list-mobile-hyperlinks-active" : "nav-list-mobile-hyperlinks-inactive"
        mobileNavbar.style.height = mobileNavbarHyperlinks.className === "nav-list-mobile-hyperlinks-inactive" ? '0' : '100%' 

        if(document.body.style.overflow === "hidden")
        {
            document.body.style.overflow = 'auto'
        }
        else
        {
            document.body.style.overflow = 'hidden'
        }
    }

    function handleSearchBarClick()
    {
        handleMobileLinkClick(); 
        handleSearchBar(true);
    }

    return(
    <>
    {/* Computer */}
    <nav id="nav">
        <ul id="nav-list">
            <li><Link to="/"><img src={FullLogo} id="nav-logo" alt="The Gadget Vault"/></Link></li>
            {generateLinks()}
            <li><FontAwesomeIcon className="nav-link" icon={faMagnifyingGlass} onClick={()=>{handleSearchBar(true);handleMobileLinkClick()}} /></li>
            <li><Link to="/cart" className="nav-link"><FontAwesomeIcon icon={faCartShopping} /></Link></li>
            <li><Link to="/account" className="nav-link"><FontAwesomeIcon icon={faUser} /></Link></li>
        </ul>
    </nav>


    {/* Mobile */}
    <nav id="nav-list-mobile">
        <div id="nav-list-mobile-icons">
            <FontAwesomeIcon id="nav-bars-icon" icon={faBars} onClick={handleMobileBarClick} />
            <Link to={"/cart"} id="nav-shopping-cart-icon"><FontAwesomeIcon icon={faCartShopping} /></Link>
        </div>

        <div id="nav-list-mobile-hyperlinks" className="nav-list-mobile-hyperlinks-inactive">
            <ul>
                <li><Link to="/" onClick={handleMobileLinkClick}>Home</Link></li>
                <li><Link to="/vehicle" onClick={handleMobileLinkClick}>Vehicle</Link></li>
                <li><Link to="/computer" onClick={handleMobileLinkClick}>Computer</Link></li>
                <li><Link to="/security" onClick={handleMobileLinkClick}>Security</Link></li>
                <li><Link to="/apparel" onClick={handleMobileLinkClick}>Apparel</Link></li>
                <li><Link to="/cooking" onClick={handleMobileLinkClick}>Cooking</Link></li>
                <li><Link to="/outdoor" onClick={handleMobileLinkClick}>Outdoor</Link></li>
                <li><Link onClick={handleSearchBarClick}>Search</Link></li>
                <li><Link to="/cart" onClick={handleMobileLinkClick}>Cart</Link></li>
                <li><Link to="/account" onClick={handleMobileLinkClick}>Account</Link></li>
            </ul>
        </div>
    </nav>

    {/* Searchbar component */}
    {searchEnabled && <Search handleSearchBar={handleSearchBar} />}
    <Outlet />
    </>
    )
}