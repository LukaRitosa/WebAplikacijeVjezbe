const express= require("express")

const app= express()

const PORT= 3000

app.get("/", (req, res)=>{
    console.log('pozvan je GET endpoint')
    res.send("Pozdrav iz Express.js ")
})

app.listen(PORT, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${PORT}`)
    }
})

console.log(app)