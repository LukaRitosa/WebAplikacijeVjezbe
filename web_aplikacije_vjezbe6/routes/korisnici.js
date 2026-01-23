import { korisnici } from '../data/podatci.js'
import { handelKorisnikValidation, nadiKorisnika } from '../middleware/korisnici.js'
import express from 'express';
import { body, validationResult, query, param } from 'express-validator';


const router = express.Router();



// dohvat svih korisnika
router.get('/', async (req, res) => {
    if (korisnici) {
        return res.status(200).json(korisnici);
    }
    return res.status(404).json({ message: 'Nema korisnika' });
});

// dohvat pojedinog korisnika
router.get('/:id', [nadiKorisnika], async (req, res) => {
        return res.status(200).json(req.pronadenKorisnik);
});

// ažuriranje email adrese pojedinog korisnika
router.patch('/:id', [param('id').isInt().withMessage('Vrijednost id mora biti integer'), 
    body('email').notEmpty().withMessage('Email prazan').isEmail().withMessage('Kriva struktura emaila'), 
    handelKorisnikValidation, nadiKorisnika], async (req, res) => {
    req.pronadenKorisnik.email = req.body.email;

    return res.status(200).json(req.pronadenKorisnik.email);
});



export default router;
