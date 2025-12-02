import express from 'express';
import pizzaRouter from './routes/pizze.js'
import narudzbeRouter from './routes/narudzbe.js'
import cors from 'cors'

const corsOptions = {
    origin: 'http://localhost:5173'
};

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors(corsOptions))
app.use('/pizze', pizzaRouter)
app.use('/narudzbe', narudzbeRouter)

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});