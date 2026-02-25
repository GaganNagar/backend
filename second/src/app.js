const express = require("express")
const noteModel = require("./models/noteModel")

const app = express()
app.use(express.json())   ///middleware


//post method ka use karke database m note ka data save kiya
app.post('/notes',async (req, res)=>{

    const data = req.body   //req se data nikala

    //yha db me data store kiya
    await noteModel.create({
        title:data.title,
        description: data.description
    })

    res.status(201).json({
        message:"note created successfully"
    })

})



//get method ka use karke ham user ki request k according database se data fetch krvakr ham server k through user ko denge
app.get('/notes', async (req, res) =>{

    const notes = await noteModel.find()    // find hmare sare notes ko dekhega or pkd kr layga  unko save kiya notes variable me 


    res.status(200).json({
        message:"Notes fetched successfully",
        Notes:notes
    })

})

//sirf ek findd karne k liye
// app.get('/notes', async (req, res) =>{

//     const notes = await noteModel.findOne({
//         title:"Gagan Nagar2"
//     })    // find hmare sare notes ko dekhega or pkd kr layga  unko save kiya notes variable me 

//     res.status(200).json({
//         message:"Notes fetched successfully",
//         Notes:notes
//     })

// })


//delete method ka use kiya db se note delete karne k liye

app.delete('/notes/:id', async (req, res) =>{

    const id = req.params.id

    await noteModel.findOneAndDelete({
        _id:id
    })

    res.status(200).json({
        message:"Note deleted successfully",
    })

})



///patch method ka use kiya or update kiyta note db me 

app.patch('/notes/:id', async (req, res) =>{

    const id = req.params.id
    const description = req.body.description

    await noteModel.findOneAndUpdate({  //// isme 2 obj parameter me lgege jisme pehle k andr note ko find karne k liye id aaygi second m updatation
        _id:id
    },
    {
        description:description
    }
    )

    res.status(200).json({
        message:"Note updated successfully",
    })

})

module.exports = app