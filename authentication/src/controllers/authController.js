const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const config = require("../config/config")


async function registerUser(req, res) {

    const { username, email, password } = req.body;


    const isUserAlreadyExists = await userModel.findOne({ email: email })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"user already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username:username,
        email:email,
        password: hashedPassword
    })


    const accessToken = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET_KEY,
    {expiresIn : "15m" })



    const refreshToken = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET_KEY,
    {expiresIn : "7d" })

    res.cookie("refreshToken", refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite : "strict",
                maxAge: 7 * 24 * 60 * 1000  // 7 din
             })
    
    res.status(201).json({
        message:"user registered successfully",
        user:{
        id : user._id,
        username:user.username,
        email:user.email
        },
        accessToken
    })

}


async function getMeUser(req, res){
    //token ko read karke user ki details send karega 

    const token = req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message : "Token not found"
        })
    }

const decoded = await jwt.verify(token, config.JWT_SECRET_KEY)

const user = await userModel.findById(decoded.id)

res.status(200).json({
    message:"User Fetched successfully",
     user:{
        id : user._id,
        username:user.username,
        email:user.email
        }
})

}

async function refreshToken(req,res){

    const refreshToken = req.cookies.refreshToken
    

    if(!refreshToken){
        return res.status(401).json({
            message : "Token not Found"
        })
    }
     try{
            const decoded = await jwt.verify(refreshToken, config.JWT_SECRET_KEY)
            const accessToken =jwt.sign({
                id:decoded.id
            }, config.JWT_SECRET_KEY,{
                expiresIn: "15m",
            })

             const newRefreshToken = jwt.sign({
                id: decoded.id
             }, config.JWT_SECRET_KEY,{
                expiresIn:"7d"
             })

             res.cookie("refreshToken", newRefreshToken,{
                httpOnly:true,
                secure:true,
                sameSite : "strict",
                maxAge: 7 * 24 * 60 * 1000  // 7 din
             })

            res.status(200).json({
                message : "accessToken refreshed successfully",
                accessToken
            })
            
        }
        catch(error){
            return res.status(401).json({
                message : "Unauthorized",
            })
        }

}

module.exports = { registerUser, getMeUser, refreshToken } 