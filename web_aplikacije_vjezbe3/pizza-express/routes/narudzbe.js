// app/pizza-express/routes/narudzbe.js

import express from 'express';
import { narudzbe, pizze } from '../data/data.js'; // učitavanje dummy podataka
import { connectToDatabase } from '../db.js'
import { FindCursor } from 'mongodb';
import { ObjectId } from 'mongodb';

const router = express.Router();



let db = await connectToDatabase();

// router.post('/', (req, res) => {
//     const { narucene_pizze, podaci_dostava } = req.body;
    
//     console.log('Primljeni podaci narudžbe:', req.body)

//     if (!narucene_pizze || narucene_pizze.length === 0) {
//         return res.status(400).json({ message: 'Nisu specificirane naručene pizze.' });
//     }
//     // Izračun ukupne cijene narudžbe
//     let ukupna_cijena = 0;
//     for (const narucena of narucene_pizze) {
//         const pizza = pizze.find(p => p.naziv.toLowerCase() === narucena.naziv.toLowerCase());
//         if (!pizza) {
//             return res.status(400).json({ message: `Pizza s nazivom '${narucena.naziv}' nije dostupna.` });
//         }
//         const cijena = pizza.cijene[narucena.velicina.toLowerCase()];
//         if (!cijena) {
//             return res.status(400).json({ message: `Veličina '${narucena.velicina}' nije dostupna za pizzu '${narucena.naziv}'.` });
//         }
//         ukupna_cijena += cijena * narucena.kolicina;
//     }
//     ukupna_cijena = Number(ukupna_cijena.toFixed(2)); // zaokruživanje ukupne cijene na 2 decimale
    

//     const nova_narudzba = {
//         id: narudzbe.length + 1,
//         narucene_pizze,
//         ukupna_cijena,
//         podaci_dostava
//     };
//     narudzbe.push(nova_narudzba);
//     res.status(201).json({ message: 'Narudžba je uspješno kreirana.', narudzba: nova_narudzba });
//     });


router.post('/', async (req, res)=>{
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

router.get('/mongo/narudzbe', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let narudzbe = await narudzbe_collection.find().toArray();

    if (narudzbe.length === 0) {
        return res.status(404).json({ error: 'Nema narudžbi' });
    }

    res.status(200).json(narudzbe);
})

router.get('/mongo/narudzbe/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) }); // instanciramo objekt ObjectId

    if (!narudzba) {
        return res.status(404).json({ error: 'Narudžba nije pronađena' });
    }

    res.status(200).json(narudzba);
})

router.delete('/mongo/narudzbe/:naziv', async (req, res)=>{
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



    export default router;
