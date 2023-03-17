import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLoadingGIF from "../../components/FormLoadingGIF";
import "../../styles/Login/Login.css"

export default function Login()
{
    const [loginForm, setLoginForm] = useState({
        username:"",
        password:""
    })

    const navigate = useNavigate()

    //Change the loginForm state to whatever was entered in the form
    function handleChange(event)
    {
        const inputName = event.target.name
        const inputValue = event.target.value
        const updatedProperty = {[inputName]:inputValue}
        setLoginForm(oldDetails => {return {...oldDetails, ...updatedProperty}})
    }

    function displayLoading(isLoading)
    {
        const loading = document.querySelector("#form-loading")
        loading.style.display = isLoading ? "flex" : "none"
    }


    //Make a request to login with the entered username and password
    async function onSubmit(event)
    {
        try
        {
            event.preventDefault()
            displayLoading(true)
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/loginAccount`, {method:"POST", credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(loginForm)})
            const responseJSON = await response.json()

            //Validation: Check if the response is not successfull "http://localhost:8000"
            if(!response.ok)
            {
                throw new Error(responseJSON.message)
            }

            navigate("/")
        }
        catch(err)
        {
            displayLoading(false)
            const errorMessageTag = document.querySelector("#login-form-validation")
            errorMessageTag.textContent = err.message
        }
    }


    return(
        <section id="login-container">
            <div id="login-form-container">
                <span id="login-form-validation"></span>
                <FormLoadingGIF />
                <form id="login-form" onSubmit={onSubmit}>
                    <h1 id="login-form-login-title">Login</h1>
                    <input name="username" type="text" id="login-form-username" placeholder="Username" onChange={handleChange} />
                    <input name="password" type="password" id="login-form-password" placeholder="Password" onChange={handleChange} />
                    <button id="login-form-login-button" onClick={onSubmit}>Log in</button>
                </form>

                <span id="login-form-or-text">OR</span>
                <button id="login-form-create-account-button" onClick={()=>navigate("/createaccount")}>Create an account</button>
            </div>
        </section>
    )
}