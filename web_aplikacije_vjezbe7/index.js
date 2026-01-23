import express from 'express';
import cors from 'cors';
import bcrypt, { hash } from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

let PORT = 3000;

const users = [
    { id: 1, username: 'johnDoe', password: 'password' },
    { id: 2, username: 'janeBB', password: 'password123' },
    { id: 3, username: 'admin', password: 'super_secret_password' }
];


app.get('/', (req, res) => {
    res.send('Spremni za autentifikaciju!');
});

let plainPassword = 'lozinka123';
let saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
        return;
    } else {
        console.log(`Hashirana lozinka: ${hash}`);
    }
}); 

app.post('/register', async (req, res)=>{

    const { username, password } = req.body;

    try {
        bcrypt.hash(plainPassword, saltRounds, (req, res)=>{
            if(hash){
                console.log('hash', hash)
                let hashirana_lozinka= hash
                users.push({id: 4, username: username, password: hashirana_lozinka})
            }
        });
        console.log(`Hashirana lozinka: ${hash}`);
        return res.status(201).json({ message: 'Korisnik uspješno registriran', user: novi_korisnik });
    } catch (err) {
        console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
    }
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let plainPassword = 'peroPeropero123'


    const user = users.find(user => user.username === username);

    if(!user){
        response.status(404).json({greska: 'Korisnik ne postoji'})
    }

    let hashedPassword= user.password

    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) {
            console.error(`Došlo je do greške prilikom usporedbe _hash_ vrijednosti: ${err}`);
            return;
        }

        if (result) {
            console.log('Lozinke se podudaraju!');
        } else {
            console.log('Lozinke se ne podudaraju!');
        }
    });

    if (user) {
        res.send('Uspješno ste autentificirani!');
    } else {
        res.status(401).send('Neuspješna autentifikacija!');
    }
});


app.listen(PORT, () => {
    console.log(`Poslužitelj dela na portu ${PORT}`);
});