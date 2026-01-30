import express from 'express';
import cors from 'cors';
import bcrypt, { hash } from 'bcrypt';
import crypto from 'crypto';
import { hashPassword, checkPassword, generateJWT, verifyJWT } from './auth.js';
import { users } from './data/users.js'
import { objave } from './data/objave.js' 
import { authMiddleware, pronadiKorisnika } from './middleware/middleware.js';

const app = express();
app.use(express.json());
app.use(cors());

let PORT = 3000;



app.get('/', (req, res) => {
    res.send('Spremni za autentifikaciju!');
});


app.post('/register', [pronadiKorisnika], async (req, res) => {
    const { username, password } = req.body;

    if(req.user){
        return res.status(400).json({poruka: 'korisnik već postoji'})
    }

    let hashedPassword = await hashPassword(password, 10); 

    users.push({ username, password: hashedPassword });

    console.log(users);

    res.status(200).send('Korisnik je uspješno registriran!');
});




app.post('/login', [pronadiKorisnika], async (req, res) => {
    const { password } = req.body;


    if (!req.user) {
        return res.status(400).send('Greška prilikom prijave!');
    }

    let tocna_lozinka = await checkPassword(password, req.user.password); 

    let jwt_payload = { 
        username: req.user.username 
    }

    let jwt_token= await generateJWT(jwt_payload)

    if (tocna_lozinka) {
        return res.status(200).json({poruka: 'Uspješna autenzifikacija', jwt_token: jwt_token });
    }

    return res.status(400).send('Greška prilikom prijave!');
});



app.get('/objave', [authMiddleware], async (req, res) => {
    let userObjave= objave.filter(o=> o.autor===req.autorizirani_korisnik.username)

    res.json(userObjave); 
});


app.listen(PORT, () => {
    console.log(`Poslužitelj dela na portu ${PORT}`);
});