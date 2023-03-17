import { useState } from "react"
import "../../styles/CreateAccount/CreateAccount.css"
import FormLoadingGIF from "../../components/FormLoadingGIF"
import { useNavigate } from "react-router-dom"


export default function CreateAccount()
{
    const [createAccountForm, setCreateAccountForm] = useState({username:"", password:"", email:""})
    const navigate = useNavigate()


    //Change the state's value to whatever was entered
    function handleChange(event)
    {
        const name = event.target.name
        const value = event.target.value

        setCreateAccountForm(oldDetails => ({...oldDetails, ...{[name]:value}}))
    }

    
    //Displays or hides a loading icon depending on the argument
    function displayLoading(isLoading)
    {
        const loadingGIF = document.querySelector("#form-loading")
        loadingGIF.style.display = isLoading ? "flex" : 'none'
    }


    //When user click the create account button
    async function handleCreateAccount(event)
    {
        try
        {
            event.preventDefault()
            displayLoading(true)

            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/createaccount`, 
            {
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(createAccountForm)
            })
            
            //Validation: Check if the request was successfull
            if(!response.ok)
            {
                const responseData = await response.json()
                displayLoading(false)
                throw new Error(responseData.message)
            }

            navigate("/login")
        }
        catch(err)
        {
            const validationTag = document.querySelector("#createaccount-error")
            validationTag.textContent = err.message
        }
    }

    
    return(
        <section id="createaccount-main-container">
            <h1 id="createaccount-title">Create an account</h1>
            <span id="createaccount-error"></span>
            <FormLoadingGIF />
            <form id="createaccount-form" onSubmit={handleCreateAccount}>
                <input id="createaccount-username" type="text" placeholder="Username" onChange={handleChange} name="username" value={createAccountForm.username} />
                <input id="createaccount-password" type="password" placeholder="Password" onChange={handleChange} name="password" value={createAccountForm.password} />
                <input id="createaccount-email" type="email" placeholder="Email" onChange={handleChange} name="email" value={createAccountForm.email} />
                <button id="createaccount-signup-button">Sign up</button>
            </form>
        </section>
    )
}