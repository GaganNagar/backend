const express = require("express")    // server create karne k liye hamne require kiya express package ko

const app = express()

//api create ki post method k sath ya uska use karke 
const notes =  [];
app.use(express.json())   /// ye ek middleware h kyuki express direct data access nhi kr skti isliye 



//1....post method ka use karke hamne ek api create ki /notes jisme user ne data send krega create karne k liye 

app.post('/notes', (req, res) =>{
    notes.push(req.body);  // data save and create karne k liye 
 console.log(req.body)

    res.status(201).json({
        message:"Note created successfully"        /// req aai tthi to ab res bhej denge ki create ho gya h 201 code k sath
    })
})


//2..get method ka use karke ham ek api create karenge jaha user server k through data fetch karvayega

app.get('/notes', (req, res)=>{

    res.status(200).json({
        message: "notes fetched successfully",
        notes:notes
    })

})



///3....delete method ka use karke ham kisi note ko delete karenge using index ok

app.delete('/notes/:index', (req, res)=>{

    // sabse pehle ham req. ke andr jo data h usme se index nikalenge jo user ko dlt karna h
    const index = req.params.index
    delete notes[index]

    res.status(200).json({
        message: "Note deleted successfully"
    })
})


//4...patch method ka use karke ham kisi note ko update karenge server par jo data h usko
app.patch('/notes/:index', (req, res)=>{

    const index = req.params.index;
    const title = req.body.title;
    const des = req.body.description

    notes[index].title = title;
    notes[index].description=des;

    res.status(200).json({
        message:"note updated successfully"
    })
})



module.exports = app; // hamne export kiya server 

