import express from 'express';
import pizzaRouter from './routes/pizze.js'
import narudzbeRouter from './routes/narudzbe.js'
import cors from 'cors'
import { connectToDatabase } from './db.js'
import { FindCursor } from 'mongodb';

const corsOptions = {
    origin: 'http://localhost:5173'
};

const app = express();

let db = await connectToDatabase();



const PORT = 3000;
app.use(express.json());
app.use(cors(corsOptions))
app.use('/pizze', pizzaRouter)
app.use('/narudzbe', narudzbeRouter)

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.get('/mongo/pizze', async (req, res)=>{
    let pizze_collection= db.collection('pizze')
    let pizze = await pizze_collection.find().toArray()
    res.status(200).json(pizze) 
})



app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});


// mongodb+srv://lukaritosa24_db_user:*aNJ3bAsJEsT2P#@fipuwacluster.kmzjhrm.mongodb.net/?appName=FIPUwaCLUSTER