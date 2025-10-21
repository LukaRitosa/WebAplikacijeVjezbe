const express= require("express")

const app= express()

const PORT= 3000

app.listen(PORT, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${PORT}`)
    }
})

console.log(app)