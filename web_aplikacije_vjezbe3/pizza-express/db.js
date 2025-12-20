import { MongoClient } from "mongodb";
import { config } from 'dotenv';

config(); // učitava osjetljive podatke iz .env datoteke

const username= process.env.MONGO_USERNAME
const password= process.env.PASSWORD

console.log(process.env.MONGO_USERNAME);
console.log(process.env.PASSWORD);

console.log()

//mongodb+srv://lukaritosa24_db_user:vu6isTDiN8HY8q0z@fipu-pizza-cluster.famrhxt.mongodb.net/?appName=FIPU-pizza-CLUSTER

// const username = 'lukaritosa24_db_user'; // vaše Mongo korisničko ime
// const password = 'vu6isTDiN8HY8q0z'; // vaša Mongo lozinka
const cluster = 'FIPU-pizza-CLUSTER'; // naziv vašeg clustera


// Pripazite! nakon lozinke, MongoDB će konkatenirati naziv vašeg clustera i random string (.cluster.mpyeq.mongodb.net)
const mongoURI = `mongodb+srv://${username}:${password}@fipu-pizza-cluster.famrhxt.mongodb.net/?appName=${cluster}`;

const db_name = process.env.MONGO_DB_NAME;

async function connectToDatabase() {
    try {
        const client = new MongoClient(mongoURI); // stvaramo novi klijent
        await client.connect(); // spajamo se na klijent
        console.log('Uspješno spajanje na bazu podataka');
        let db = client.db(db_name); // odabiremo bazu podataka
        return db;
    } catch (error) {
        console.error('Greška prilikom spajanja na bazu podataka', error);
        throw error;
    }
}


export { connectToDatabase };