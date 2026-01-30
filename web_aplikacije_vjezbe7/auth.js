import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export async function hashPassword(plainPassword, saltRounds) {
    try {
        let _hash_ = await bcrypt.hash(plainPassword, saltRounds); // hashiranje lozinke
        return _hash_;
    } catch (err) {
        console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
        return null;
    }
}


export async function checkPassword(plainPassword, hashedPassword) {
    try {
        let result = await bcrypt.compare(plainPassword, hashedPassword); // usporedba lozinke i hash vrijednosti
        return result;
    } catch (err) {
        console.error(`Došlo je do greške prilikom usporedbe _hash_ vrijednosti: ${err}`);
        return false;
    }
}


export async function generateJWT(payload) {
    try {
        let token = jwt.sign(payload, JWT_SECRET); // generiranje JWT tokena s payloadom i enkripcijskim ključem
        return token;
    } catch (err) {
        console.error(`Došlo je do greške prilikom generiranja JWT tokena: ${err}`);
        return null;
    }
}


export async function verifyJWT(token) {
    try {
        let decoded = jwt.verify(token, JWT_SECRET); // provjera valjanosti JWT tokena
        return decoded;
    } catch (err) {
        console.error(`Došlo je do greške prilikom verifikacije JWT tokena: ${err}`);
        return null;
    }
}