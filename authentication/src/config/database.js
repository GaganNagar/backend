const mongoose = require("mongoose")
const config = require("../config/config")

async function connectToDb() {

    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("db Connected successfully")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDb