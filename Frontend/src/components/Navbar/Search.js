import "../../styles/Navbar/Search.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faX} from "@fortawesome/free-solid-svg-icons"
import {Link} from "react-router-dom"
import { useEffect, useState } from "react"

export default function Search({handleSearchBar})
{
    const [results, setResults] = useState("")
    const [searchText, setSearchText] = useState("")

    //Everytime the searchText state is changed, make a search API request with the searchText
    //If any products are returned convert them into components and store them in the results state
    useEffect(()=>
    {
        async function getProducts()
        {
            try
            {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/search/${searchText}`)
                const data = await response.json()
                const products = await data.map((product)=>{return <li className="home-search-product" key={product._id}><Link className="home-search-product-link" to={`/product/${product._id}`} onClick={()=>{handleSearchBar(false);}}>{product.title}</Link></li>})
                setResults(products)
            }
            catch(err)
            {
                setResults("")
            }
        }

        getProducts()
    }, [searchText])


    //Updates the searchText state on every change
    function handleSearchText(event)
    {
        setSearchText(event.target.value)
    }
    
    
    return(
        <div id="home-search-container">
            <FontAwesomeIcon id="home-search-cancel" icon={faX} onClick={()=>handleSearchBar(false)} />

            <form id="home-search-form" onSubmit={(e)=>{e.preventDefault()}}>
                <input type="text" placeholder="Search for items here.." value={searchText} onChange={(event)=>handleSearchText(event)}/>
            </form>

            <div id="home-search-results">
                <ul id="home-search-product-list">
                    {results}
                </ul>
            </div>
        </div>
    )
}