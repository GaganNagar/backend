require("dotenv").config();

if(!process.env.MONGO_URI){
    throw new error("MONGO_URI not found in dot env")
}
if(!process.env.JWT_SECRET_KEY){
    throw new error("JWT SECRET KEY not found in dot env")
}


const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}

module.exports = config 
