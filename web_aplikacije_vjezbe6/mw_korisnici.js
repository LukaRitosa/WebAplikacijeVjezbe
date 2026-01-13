
// middleware/korisnici.js


const validirajEmail= (req, res, next)=>{
    if (req.body.email && typeof req.body.email === 'string') {
        return next()
    } 
    else{
        return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' })
    }
}

const nadiKorisnika= (req, res, next)=>{
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
// izvoz middleware funkcija
export { validirajEmail, nadiKorisnika };