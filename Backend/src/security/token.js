const crypto = require('crypto')
const Sessions = require("../models/Sessions")

module.exports = 
{
    //Generate a random token
    generateToken: ()=>
    {
        return crypto.randomUUID()
    },

    //Remove a users session from the database
    removeToken: async (username)=>
    {
        await Sessions.deleteMany({username:username})
    }
}