import express from 'express'
import moviesRouter from './routes/movies.js'
import actorsRouter from './routes/actors.js'
import { body, validationResult, query, param } from 'express-validator';

let port = 3000
let app= express()

app.use(express.json())


const requestLogger = (req, res, next) => {
    const server_naziv = 'movie-server';
    const date = new Date().toLocaleString();
    const method = req.method; // HTTP metoda
    const url = req.originalUrl; // URL zahtjeva
    console.log(`[${server_naziv}] [${date}]  ${method} ${url}`);
    next();
};

app.use(requestLogger);

const xssZastita = [
    query('*').trim().escape(),

    param('*').trim().escape(),

    body('*').trim().escape()
];

app.use(xssZastita);


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

