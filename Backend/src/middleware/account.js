const db = require("../config/db")
const Users = require("../models/Users")
const Sessions = require("../models/Sessions")
const bcryptMethods = require("../security/bcrypt")
const token = require('../security/token')
const cookie = require("cookie")

module.exports =
{
    createAccount: async (req, res)=>
    {
        try
        {
            let requestUsername = req.body?.username || ""
            let requestPassword = req.body?.password || ""
            let requestEmail = req.body?.email || ""

            //Validation: Check if all the fields are not empty
            if(requestUsername.length===0 || requestPassword.length===0 || requestEmail.length===0)
            {
                throw Object.assign(new Error('Fill out all the required fields'), 
                { 
                    data: 
                    {
                      errorCode: 400,
                      errorMessage: 'Fill out all the required fields'
                    }
                });
            }

            //Validation: Check if there's a username in the database with the requested username
            await db()
            const checkAccount = await Users.find({username:requestUsername})
            if(checkAccount.length > 0)
            {
                throw Object.assign(new Error('Username already in use'), 
                { 
                    data: 
                    {
                      errorCode: 409,
                      errorMessage: 'Username already in use'
                    }
                });
            }

            //VALIDATIONS PASSED//
            //Insert a new account into the database and with a hash the password and respond with OK status code
            const hashedPassword = await bcryptMethods.hashPassword(requestPassword.toLowerCase())

            await Users.create({
                username:req.body.username.toLowerCase(),
                email:req.body.email.toLowerCase(),
                password:hashedPassword,
                address:"",
                cart:[],
            })

            res.status(200).send({message:"Account created"})
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    loginAccount: async (req, res)=>
    {
        try
        {
            const requestUsername = req.body?.username || ""
            const requestPassword = req.body?.password || ""
            
            //Validation: Check if the request's fields are empty
            if(requestUsername.length === 0 || requestUsername.length === 0)
            {
                throw Object.assign(new Error('Fill out all required fields'), 
                { 
                    data: 
                    {
                      errorCode: 400,
                      errorMessage: 'Fill out all required fields'
                    }
                });
            }

            //Validation: Check if there's an account in the db with the requests username
            await db()
            const userRecord = await Users.findOne({username:requestUsername.toLowerCase()})
            if(userRecord)
            {   
                //Validation: Check if the userRecord has the same password as the requests password
                const verify = await bcryptMethods.checkPassword(requestPassword.toLowerCase(), userRecord.password)
                if(!verify)
                {
                    throw Object.assign(new Error('Password incorrect'), 
                    { 
                        data: 
                        {
                          errorCode: 400,
                          errorMessage: 'Username or password incorrect'
                        }
                    });
                }
            }
            else
            {
                throw Object.assign(new Error('Username incorrect'), 
                { 
                    data: 
                    {
                      errorCode: 400,
                      errorMessage: 'Username or password incorrect'
                    }
                });
            }

            //VALIDATIONS PASSED//
            //Remove any previous sessions the user might have form the database
            //Generate a cookie and store in on the client's cookies and on the database
            await token.removeToken(userRecord.username)

            const sessionIdCookie = token.generateToken()
            const cookieExpireDate = new Date(new Date().getTime() + 60*60*1000).toUTCString()

            await Sessions.create({username:userRecord.username, sessionId:sessionIdCookie, expireDate: cookieExpireDate})
            const sessionCookie = cookie.serialize('sessionId', sessionIdCookie, {
                domain: 'thegadgetvault.online',
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            await res.setHeader('Set-Cookie', sessionCookie)
            await res.status(200).send({message:"User logged in"})
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },

    
    logoutUser: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId

            //Delete the users session from the database and remove the clients sessionId cookie
            await db()
            await Sessions.deleteOne({sessionId:sessionIdCookie})
            
            res.clearCookie('sessionId')
            res.status(200).send({message:"Logged out"})
        }
        catch(err)
        {
            res.status(500).send({message:"An unexpected error has occurred"})
        }
    },

    
    authorizeSession: async (req, res, next)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId

            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})

            //Validation: Check if the clients sessionId cookie exists in the database
            if(!sessionRecord)
            {
                throw Object.assign(new Error('Session does not exist'), 
                { 
                    data: 
                    {
                      errorCode: 401,
                      errorMessage: 'Unable to find session'
                    }
                });
            }

            //Validation: Check if the cookie found in the database is not expired
            const currentDate = new Date().toUTCString();
            if(sessionRecord.expireDate.toUTCString() < currentDate)
            {
                await sessionRecord.delete()
                throw Object.assign(new Error('Session cookie has expired'), 
                { 
                    data: 
                    {
                      errorCode: 401,
                      errorMessage: 'The session has expired. Log in again'
                    }
                });
            }

            //VALIDATIONS PASSED//
            //Load the next middleware
            next()
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    getAccount: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId
            
            await db()
            const sessionRecord = await Sessions.findOne({sessionId:sessionIdCookie})
            const userRecord = await Users.findOne({username:sessionRecord.username}, {username:1, email:1, address:1, cart:1})
            
            //Validation: Check if a user exists in the database with the sessionId cookie
            if(!userRecord)
            {
                throw Object.assign(new Error('The user could not be found in the database'), 
                { 
                    data: 
                    {
                      errorCode: 404,
                      errorMessage: "Could not find account"
                    }
                });
            }
            
            res.json(userRecord)
        }
        catch(err)
        {
            const errorCode = err.data?.errorCode || 500
            const errorMessage = err.data?.errorMessage || "An unexpected error has occurred"
            res.status(errorCode).send({message:errorMessage})
        }
    },


    updateAccount: async (req, res)=>
    {
        try
        {
            const sessionIdCookie = req.cookies.sessionId
            const newAccountData = req.body.newAccountData

            for(let prop in newAccountData)
            {
                newAccountData[prop] = newAccountData[prop].toLowerCase()
            }
            
            await db()
            const sessionRecord = await Sessions.findOne({sessionId: sessionIdCookie})

            //Update the users account with the data from the request
            if(newAccountData.password)
            {
                newAccountData.password = await bcryptMethods.hashPassword(newAccountData.password)
            }
            await Users.updateOne({username:sessionRecord.username}, newAccountData, {runValidators:true})
            res.status(200).send({message:"Account details updated"})
        }
        catch(err)
        {
            res.status(400).send({message:"Fill out all the required fields correctly"})
        }
    }
}