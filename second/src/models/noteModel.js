const mongoose = require('mongoose')

//ab yha par db ko hmara notes ka data ka type  btane k liye hame schema create karna pdega

const noteScheme = new mongoose.Schema({
    title:String,
    description: String
})


//yhi par ham create karenge note model kyuki hame note se related operations karne h to hamne uska ek noteModel create kiya
//jo ki hamare notes k database hoga 
const noteModel = mongoose.model("notes", noteScheme)

module.exports = noteModel