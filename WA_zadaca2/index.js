import object from 'module'
import express from 'express'
import nekretnineRouter from './routes/nekretnine.js';

let port = 3000
let app= express()

app.use(express.json())
app.use('/nekretnine', nekretnineRouter);



app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)