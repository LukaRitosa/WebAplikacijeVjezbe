import express from 'express'
import path from 'path'
import boatsRouter from './routes/boats.js'
import najamRouter from './routes/najam.js'



let port = 3000
let app= express()

app.use(express.json())
app.use('/boats', boatsRouter)
app.use('/najam', najamRouter)

let relativna = path.join('public', 'index.html');
let apsolutna = path.resolve(relativna);


app.get('/', (req, res)=>{
    return res.status(200).sendFile(apsolutna)
})


app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)



