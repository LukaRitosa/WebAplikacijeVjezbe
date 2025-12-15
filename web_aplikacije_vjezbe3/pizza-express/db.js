import { MongoClient } from "mongodb";
import { config } from 'dotenv';

config(); // učitava osjetljive podatke iz .env datoteke

let username= process.env.MONGO_USERNAME
let password= process.env.PASSWORD

console.log(process.env.MONGO_USERNAME);
console.log(process.env.PASSWORD);

console.log()

// const username = 'lukaritosa24_db_user'; // vaše Mongo korisničko ime
// const password = '*aNJ3bAsJEsT2P#'; // vaša Mongo lozinka
const cluster = 'FIPUwaCLUSTER'; // naziv vašeg clustera

// Pripazite! nakon lozinke, MongoDB će konkatenirati naziv vašeg clustera i random string (.cluster.mpyeq.mongodb.net)
const mongoURI = `mongodb+srv://${username}:${password}@fipuwacluster.kmzjhrm.mongodb.net/?appName=${cluster}`;



async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURI); // stvaramo novi klijent
        await client.connect(); // spajamo se na klijent
        console.log('Uspješno spajanje na bazu podataka');
        let db = client.db('pizza_db'); // odabiremo bazu podataka
        return db;
    } catch (error) {
        console.error('Greška prilikom spajanja na bazu podataka', error);
        throw error;
    }
}


export { connectToDatabase };