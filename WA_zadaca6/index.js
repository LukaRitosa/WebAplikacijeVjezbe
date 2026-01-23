import express from 'express'
import moviesRouter from './routes/movies.js'
import actorsRouter from './routes/actors.js'
import { body, validationResult, query, param } from 'express-validator';

let port = 3000
let app= express()

app.use(express.json())


const requestLogger = (req, res, next) => {
    const date = new Date().toLocaleString();
    const method = req.method; // HTTP metoda
    const url = req.originalUrl; // URL zahtjeva
    console.log(`[${date}] : ${method} ${url}`);
    next();
};

app.use(requestLogger);

app.use('/movies', moviesRouter)

app.use('/actors', actorsRouter)

app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)

