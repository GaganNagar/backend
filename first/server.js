// isme ham hamare create hue server ko start karenge to uske liye hame  usko import karna pdega ya require 
const app =  require("./src/app");


app.listen(3000, ()=>{
    console.log("server created successfully");
})