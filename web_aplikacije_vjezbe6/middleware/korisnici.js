
import { korisnici } from '../data/podatci.js'
import { validationResult } from 'express-validator'


export const validirajEmail= (req, res, next)=>{
    if (req.body.email && typeof req.body.email === 'string') {
        return next()
    } 
    else{
        return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' })
    }
}

export const nadiKorisnika= (req, res, next)=>{
    const id_route_param = parseInt(req.params.id);
    const korisnik = korisnici.find(korisnik => korisnik.id === id_route_param);
    if(korisnik){
        req.pronadenKorisnik= korisnik
        return next()
    }
    else{
        return res.status(404).json({message: 'Korisnik nije pronaden'})
    }
}


export const handelKorisnikValidation= (req, res, next)=>{
    const error= validationResult(req)
    
        if(error.isEmpty()){
            return next()
        } else{
            return res.status(400).json({greska: error.array()})
        }
}