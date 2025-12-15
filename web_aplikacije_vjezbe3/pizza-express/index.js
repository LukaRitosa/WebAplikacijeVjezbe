import express from 'express';
import pizzaRouter from './routes/pizze.js'
import narudzbeRouter from './routes/narudzbe.js'
import cors from 'cors'
import { connectToDatabase } from './db.js'

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

app.get('/pizze', async (req, res) => {
    let pizze_collection = db.collection('pizze'); // referenca na kolekciju 'pizze'
    let allPizze = await pizze_collection.find().toArray(); // pretvorba u Array
    res.status(200).json(allPizze);
});

app.get('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let pizza = await pizze_collection.find({ naziv: naziv_param }).toArray();
    // ili
    // let pizza = await pizze_collection.findOne({ naziv: naziv_param }); // samo 1 rezultat, ne koristimo metodu Iterator.toArray()
    res.status(200).json(pizza);
});

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});


// mongodb+srv://lukaritosa24_db_user:*aNJ3bAsJEsT2P#@fipuwacluster.kmzjhrm.mongodb.net/?appName=FIPUwaCLUSTER