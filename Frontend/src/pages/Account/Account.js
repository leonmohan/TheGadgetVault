import { useEffect, useState } from "react"
import "../../styles/Account/Account.css"
import FormLoadingGIF from "../../components/FormLoadingGIF"
import { useNavigate } from "react-router-dom"
import AccountInfoLoading from "../../assets/loading.gif"

export default function Account()
{
    const [enabledInput, setEnabledInput] = useState({
        password:false,
        email:false,
        address:false
    })
    const [accountFormDetails, setAccountFormDetails] = useState({
        password:"",
        email:"",
        address:""
    })
    const [accountDisplay, setAccountDisplay] = useState({})
    const navigate = useNavigate()


    //Depending on the isLoading parameter (true or false) display the loading icons
    function displayLoading(isLoading)
    {
        const accountInfoLoading = document.querySelector("#account-info-loading")
        const accountForm = document.querySelector("#account-form")

        accountInfoLoading.style.display = isLoading ? 'flex' : 'none' 
        accountForm.style.display = isLoading ? 'none' : 'flex'
    }

    function displayFormLoading(isLoading)
    {
        const formLoading = document.querySelector("#form-loading")
        formLoading.style.display = isLoading ? 'flex' : 'none'
    }

    function displayValidationTag(isDisplayed, text)
    {
        const validationTag = document.querySelector("#account-form-validation")
        
        validationTag.style.display = isDisplayed ? 'flex' : 'none'
        validationTag.textContent = text || ""
    }

    //Gets the users data. If the user isn't found, redirect to the login page
    async function getUserData()
    {
        try
        {
            displayLoading(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/getAccount`, {method:"GET", credentials:"include"})
            const userInfo = await response.json()

            if(!response.ok)
            {
                throw new Error(userInfo.message)
            }

            displayLoading(false)
            setAccountDisplay(userInfo)
            setAccountFormDetails({password:"", email:"", address:""})
        }
        catch(err)
        {
            navigate("/login")
        }
    }


    //When the page is first rendered, invoke, getUserData()
    useEffect(()=>{
        getUserData()
    }, [])


    //When the user clicks edit, enable the input to be used
    function handleInputToggle(event)
    {
        const input = event.target.name

        setEnabledInput(oldSettings => { 
            return {...oldSettings, ...{[input]:!enabledInput[input]}}
        })
    }

    //On every change to the input, update the accountFormDetails state to hold that information
    function handleFormChange(event)
    {
        setAccountFormDetails(oldDetails => {
            return {...oldDetails, ...{[event.target.name]:event.target.value}}
        })
    }

    //Validation: Check if the client is able to submit based off the enabledInput state.
    //If there is no enabled inputs, return false, else true
    function canSubmit()
    {
        for(let prop in enabledInput)
        {
            if(enabledInput[prop] === true)
            {
                return true
            }
        }

        return false
    }

    //When the client clicks save changes submit the form
    async function handleSubmit(event)
    {
        try
        {
            event.preventDefault();
            displayFormLoading(true)

            //For each enabledInput, if there state is enabled, add them to the newAccountData object
            const newAccountData = {}
            for(let prop in enabledInput)
            {
                if(enabledInput[prop] === true)
                {
                    newAccountData[prop] = accountFormDetails[prop]
                }
            }

            //Send the newAccountData object to update the user's account
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/updateAccount`, {method:"PUT", headers:{'Content-Type':'application/json'}, credentials:'include', body:JSON.stringify({newAccountData:newAccountData})})
            const responseJson = await response.json()

            //Validation: Check if the request was successfull
            if(!response.ok)
            {
                throw new Error(JSON.stringify({status:response.status, message:responseJson.message}))
            }

            //Reset the form's state and refresh the page
            displayFormLoading(false)
            setEnabledInput({
                password:false,
                email:false,
                address:false
            })
            getUserData()
        }
        catch(err)
        {
            displayFormLoading(false)

            //If the status code is 400, display the error message using the validation tag
            if(JSON.parse(err.message).status === 400)
            {
                displayValidationTag(true, JSON.parse(err.message).message)
            }
            //If the status code is 401, the user is no authorized. Redirect to login page
            else if(JSON.parse(err.message).status === 401)
            {
                navigate("/login")
            }
        }
    }

    async function handleLogout()
    {
        try
        {
            displayFormLoading(true)
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PATH}/logoutAccount`, {method:"DELETE", credentials:'include'})

            //Validation: Check if the request was successfull
            if(!response.ok)
            {
                const responseJson = await response.json()
                throw new Error(responseJson.message)
            }

            navigate("/login")
        }
        catch(err)
        {
            console.error(err.message)
        }
    }

    return(
        <>
            <section id="account-form-container">
                <img id="account-info-loading" src={AccountInfoLoading} />
                <form id="account-form" onSubmit={handleSubmit}>
                    <span id="account-form-validation" />
                    <p id="account-username">{accountDisplay.username}</p>
                    <FormLoadingGIF />
                    <div className="account-input-container">
                        {enabledInput.password ? <input className="account-input-field" type="password" name="password" value={accountFormDetails.password} onChange={handleFormChange} placeholder="New password" /> : <p className="account-input-text">*********</p>} 
                        <button className="account-input-button" name="password" type="button" onClick={handleInputToggle}>{enabledInput.password ? 'Cancel' : 'Edit password'}</button>
                    </div>

                    <div className="account-input-container">
                        {enabledInput.email ? <input className="account-input-field" type="text" name="email" value={accountFormDetails.email} onChange={handleFormChange} placeholder="Email" /> : <p className="account-input-text">{accountDisplay.email}</p>} 
                        <button className="account-input-button" name="email" type="button" onClick={handleInputToggle}>{enabledInput.email ? 'Cancel' : 'Edit email'}</button>
                    </div>

                    <div className="account-input-container">
                        {enabledInput.address ? <input className="account-input-field" type="text" name="address" value={accountFormDetails.address} onChange={handleFormChange} placeholder="Address" /> : <p className="account-input-text">{accountDisplay.address}</p>} 
                        <button className="account-input-button" name="address" type="button" onClick={handleInputToggle}>{enabledInput.address ? 'Cancel' : 'Edit address'}</button>
                    </div>

                    <div className="account-input-container" id="account-submit-button">
                        {canSubmit() && <button className="account-input-button">Save Changes</button>}
                    </div>

                    <button id="account-orders-button"type="button" onClick={()=>navigate("/orders")}>Order history</button>
                    <button type="button" id="account-logout-button" onClick={handleLogout}>Log out</button>
                </form>
            </section>
        </>
    )
}