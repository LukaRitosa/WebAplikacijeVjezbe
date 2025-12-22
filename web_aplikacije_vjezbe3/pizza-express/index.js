import express from 'express';
import pizzaRouter from './routes/pizze.js'
import narudzbeRouter from './routes/narudzbe.js'
import cors from 'cors'
import { connectToDatabase } from './db.js'
import { FindCursor } from 'mongodb';
import { ObjectId } from 'mongodb';

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

app.get('/mongo/pizze/:naziv_pizze', async (req, res)=>{
    const naziv_pizze=req.params.naziv_pizze

    let pizze_collection=db.collection('pizze')
    let pizza= await pizze_collection.findOne({naziv: naziv_pizze})
    res.status(200).json(pizza)
})

app.post('/mongo/pizze', async (req, res)=>{
    let pizze_collection = db.collection('pizze')
    const nova_pizza=req.body

    let result={}
    
    try{
        result= await pizze_collection.insertOne(nova_pizza)
        return res.status(201).json(result.insertedId)
    } catch (error) {
        console.log(error.errorResponse)
        return res.status(400).json({error: error.errorResponse})
    }
})

app.post('/mongo/narudzbe', async (req, res)=>{
    let narudzbe_collection = db.collection('narudzbe')
    const nova_narudzba=req.body

    let obavezniKljucevi = ['podaci_dostava', 'ukupna_cijena', 'narucene_pizze']

    let obavezniKljuceviStavke = ['naziv', 'kolicina', 'velicina']
    
    let obavezniKljuceviPodatci = ['prezime', 'adresa', 'telefon']

    

    if (!obavezniKljucevi.every(kljuc => kljuc in nova_narudzba)) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
    }

    if (!nova_narudzba.narucene_pizze.every(stavka => obavezniKljuceviStavke.every(kljuc => kljuc in stavka))) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi u stavci narudžbe' });
    }

    if (!obavezniKljuceviPodatci.every(kljuc => kljuc in nova_narudzba.podaci_dostava)){
        return res.status(400).json({error: 'Nedostaju obavezni podaci za dostavu'})
    }

    if (!nova_narudzba.narucene_pizze.every(stavka => {
            return Number.isInteger(stavka.kolicina) && stavka.kolicina > 0 && ['mala', 'srednja', 'jumbo'].includes(stavka.velicina)
        })) {
        return res.status(400).json({ error: 'Neispravni podaci u stavci narudžbe' });
    }

    let pizze_collection= db.collection('pizze')

    let dostupne_pizze= await pizze_collection.find().toArray()

    if(!nova_narudzba.narucene_pizze.every(stavka=> dostupne_pizze.some(pizza=> pizza.naziv==stavka.naziv))){
        return res.status(400).json({greska: 'Odabrali ste pizzu koje nema u ponudi'})
    }

    let result={}
    
    try{
        result= await narudzbe_collection.insertOne(nova_narudzba)
        return res.status(201).json(result.insertedId)
    } catch (error) {
        console.log(error.errorResponse)
        return res.status(400).json({error: error.errorResponse})
    }
})

app.get('/mongo/narudzbe', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let narudzbe = await narudzbe_collection.find().toArray();

    if (narudzbe.length === 0) {
        return res.status(404).json({ error: 'Nema narudžbi' });
    }

    res.status(200).json(narudzbe);
})

app.get('/mongo/narudzbe/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) }); // instanciramo objekt ObjectId

    if (!narudzba) {
        return res.status(404).json({ error: 'Narudžba nije pronađena' });
    }

    res.status(200).json(narudzba);
})

app.delete('/mongo/narudzbe/:naziv', async (req, res)=>{
    let pizze_collection= db.collection('pizze')
    let naziv_param= req.params.naziv

    try{
        let result= await pizze_collection.deleteOne({naziv: naziv_param})
        return res.status(200).json({deletedCount: result.deletedCount})
    } catch(error){
        console.log(error.errorResponse)
        return res.status(400).json({error: error.errorResponse})
    }
})


app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});


