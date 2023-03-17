const mongoose = require('mongoose')

//Makes a connection to the database
module.exports = async function connectDB()
{
    try
    {
        mongoose.connect(process.env.DB_CONNECTION_STRING)
    }
    catch
    {
        throw Object.assign(new Error('Unable to connect to database'), 
        { 
            data: 
            {
              errorCode: 500,
              errorMessage: 'An unexpected error has occurred'
            }
        });     
    }
}