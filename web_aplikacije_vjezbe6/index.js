import express from 'express'
import {korisnici} from './data/podatci.js'
import { validirajEmail, nadiKorisnika } from './mw_korisnici.js'

let port = 3000
let app= express()

app.use(express.json())



// dohvat svih korisnika
app.get('/korisnici', async (req, res) => {
    if (korisnici) {
        return res.status(200).json(korisnici);
    }
    return res.status(404).json({ message: 'Nema korisnika' });
});

// dohvat pojedinog korisnika
app.get('/korisnici/:id', [nadiKorisnika], async (req, res) => {
        return res.status(200).json(req.pronadenKorisnik);
});

// ažuriranje email adrese pojedinog korisnika
app.patch('/korisnici/:id', [validirajEmail, nadiKorisnika], async (req, res) => {
    req.pronadenKorisnik.email = req.body.email;
    console.log(korisnici);
    return res.status(200).json(req.pronadenKorisnik.email);
});



app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)

