import express from 'express';
import { connectToDatabase } from '../db.js'
import { FindCursor, ObjectId } from 'mongodb';
import { nadiKorisnika, imeKorisnika } from '../middleware/middleware.js';
import { hashPassword, checkPassword, generateJWT } from '../auth.js';

const router = express.Router();


let db = await connectToDatabase();



router.post('/register', [nadiKorisnika], async (req, res)=>{
    const { ime, password } = req.body;

    
    if(req.user){
        return res.status(400).json({greska: 'korisnik već postoji'})
    }

    let user_collection=db.collection('users')

    let hash_lozinka= await hashPassword(password, 10)

    if (!hash_lozinka) {
        return res.status(500).json({ greska: 'Greška kod hashiranja lozinke' });
    }

    let rez={}
    try{
        rez= user_collection.insertOne({ime: ime, password: hash_lozinka})
        return res.status(201).json(rez.insertedId)
    }catch(error){
        return res.status(500).json({greska: `desila se greška: ${error}`})
    }
    
})

router.post('/login', [nadiKorisnika], async(req, res)=>{
    const { password }= req.body

    if(!req.user){
        return res.status(400).json({greska: 'korisnik ne postoji'})
    }

    const postoji_lozinka= await checkPassword(password, req.user.password)

    let jwt_payload={
        ime: req.user.ime
    }

    let jwt_token= await generateJWT(jwt_payload)

    if(postoji_lozinka){
        return res.status(200).json({message: 'Uspješna autentifikacija', jwt_token: jwt_token})
    }

    return res.status(400).send('Greška prilikom prijave!')
})

router.get('/ja', [imeKorisnika], async (req, res)=>{
    return res.json({
        ime: req.user.ime
    })
})



export default router;