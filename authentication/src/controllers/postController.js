const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function createPost (req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.id);
        console.log(decoded)

    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }


    res.status(201).json({
        message:"post created successfully"
    })
}

module.exports = {
    createPost
}