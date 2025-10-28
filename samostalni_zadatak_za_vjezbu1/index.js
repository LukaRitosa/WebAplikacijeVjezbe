const express= require("express")
const path=require("path")

const app= express()

const PORT= 3000

app.get("/", (req, res)=>{
    console.log('pozvan je GET endpoint')
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/about", (req, res)=>{
    console.log('pozvan je GET endpoint')
    res.sendFile(__dirname + "/public/about.html")
})


app.get("/users", (req, res)=>{
    
    const users=[
        {
            id: 0, ime:"Luka", prezime: "Ritoša"
        },
        {
            id: 1, ime:"Ivo", prezime: "Ivić"
        },
        {
            id: 2, ime:"Marko", prezime: "Markić"
        }
    ]
    res.json(users)
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