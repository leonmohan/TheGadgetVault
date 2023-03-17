const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports =
{
    hashPassword:(password)=>
    {
        //Generate a hashed password based off the password parameter
        return new Promise((resolve, reject)=>
        {
            bcrypt.genSalt(saltRounds, (err, salt)=>
            {
                bcrypt.hash(password, salt, (err, hash)=>
                {
                    resolve(hash) 
                })
            })
        })
    },

    checkPassword: async (password, hashedPassword)=>
    {
        //Using bcrypt check if the plaintext password matches the hashed password
        return new Promise((resolve, reject)=>
        {
            bcrypt.compare(password, hashedPassword, (err, result)=>{
                resolve(result)
            })
        })
    }
}   