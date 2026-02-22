const express = require("express")    // server create karne k liye hamne require kiya express package ko

const app = express()

//api create ki post method k sath ya uska use karke 
const notes =  [];
app.use(express.json())   /// ye ek middleware h kyuki express direct data access nhi kr skti isliye 

app.post('/notes', (req, res) =>{
    notes.push(req.body);  // data save and create karne k liye 
 console.log(req.body)

    res.status(201).json({
        message:"Note created successfully"        /// req aai tthi to ab res bhej denge ki create ho gya h 201 code k sath
    })
})

module.exports = app; // hamne export kiya server 