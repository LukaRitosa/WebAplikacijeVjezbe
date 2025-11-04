import object from 'module'
import express from 'express'
import pizzeRouter from './routes/pizze.js';

let port = 3000
let app= express()

app.use(express.json())
app.use('/pizze', pizzeRouter);



app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)



/*

bitno za zapamtit


find
findIndex
map, filter, reduce 
splice, slice
some, every


*/