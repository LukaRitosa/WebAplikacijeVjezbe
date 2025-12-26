// app/pizza-express/routes/pizze.js

import express from 'express';
import { pizze } from '../data/data.js'; // učitavanje dummy podataka
import { connectToDatabase } from '../db.js'
import { FindCursor } from 'mongodb';
import { ObjectId } from 'mongodb';

const router = express.Router();


let db = await connectToDatabase();

// // GET /pizze - Dohvaćanje svih pizza (npr. GET /pizze)
// router.get('/', (req, res) => {
//     if (pizze.length === 0 || !pizze) {
//         return res.status(404).json({ message: 'Nema dostupnih pizza.' });
//     }

//     res.status(200).json(pizze);
// });

// // GET /pizze/:naziv - Dohvaćanje pizze prema nazivu (npr. GET /pizze/Margherita)

// router.get('/:naziv', (req, res) => {
//     const naziv = req.params.naziv;
//     const pizza = pizze.find(p => p.naziv.toLowerCase() === naziv.toLowerCase());

//     if (!pizza) {
//         return res.status(404).json({ message: `Pizza s nazivom '${naziv}' nije pronađena.` });
//     }

//     res.status(200).json(pizza);
// });


router.get('/', async (req, res)=>{
    
    let naziv_query= req.query.naziv
    let cijena_min_query= req.query.cijena_min
    let cijena_max_query= req.query.cijena_max
    let sort_query= req.query.sort

    try{
        let pizze_collection= db.collection('pizze')
        
        let pipeline= []

        if(naziv_query){
            pipeline.push({$match: {naziv: {$regex: naziv_query}}})
        }
        
        if(cijena_min_query){
            pipeline.push({$match: {'cijene.srednja': {$gte: Number(cijena_min_query)}}})
        }
        
        if(cijena_max_query){
            pipeline.push({$match: {'cijene.srednja': {$lte: Number(cijena_max_query)}}})
        }
        
        if(sort_query==='asc'){
            pipeline.push({ $sort:{'cijene.srednja': 1}})
        }
        else if(sort_query==='desc'){
            pipeline.push({ $sort:{'cijene.srednja': -1}})
        }

        let pizze = await pizze_collection.aggregate(pipeline).toArray()
        res.status(200).json(pizze)
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Došlo je do greške na serveru.' });
    }
})

router.get('/:naziv_pizze', async (req, res)=>{
    const naziv_pizze=req.params.naziv_pizze

    let pizze_collection=db.collection('pizze')
    let pizza= await pizze_collection.findOne({naziv: naziv_pizze})
    res.status(200).json(pizza)
})

router.post('/', async (req, res)=>{
    let pizze_collection = db.collection('pizze')
    const nova_pizza=req.body


    let obavezniKljucevi = ['naziv', 'sastojci', 'cijene', 'slika_url']

    let obavezniKljuceviCijene = ['mala', 'srednja', 'jumbo']
    


    if (!obavezniKljucevi.every(kljuc => kljuc in nova_pizza)) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi' });
    }

    if (!obavezniKljuceviCijene.every(kljuc => kljuc in nova_pizza.cijene)){
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi u cijenama' });
    }


 
    if( typeof nova_pizza.cijene.mala !== 'number' || nova_pizza.cijene.mala < 0 ||
        typeof nova_pizza.cijene.srednja !== 'number' || nova_pizza.cijene.srednja < 0 ||
        typeof nova_pizza.cijene.jumbo !== 'number' || nova_pizza.cijene.jumbo < 0){
            return res.status(400).json({error: 'Neispravne cijene'})
    }

    let result={}
    
    try{
        result= await pizze_collection.insertOne(nova_pizza)
        return res.status(201).json(result.insertedId)
    } catch (error) {
        console.log(error.errorResponse)
        return res.status(400).json({error: error.errorResponse})
    }
})

export default router;