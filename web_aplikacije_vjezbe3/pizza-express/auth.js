import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(plainLozinka, rundeSoli){
    try{
        let hashirano= await bcrypt.hash(plainLozinka, rundeSoli)
        return hashirano
    } catch(error){
        console.error(`desila se greška ${error}`)
        return null
    }
}



export async function checkPassword(plainLozinka, hashLozinka){
    try{
        let rez= await bcrypt.compare(plainLozinka, hashLozinka)
        return rez
    } catch(error){
        console.error(`Došlo je do greške prilikom usporedbe hash vrijednosti: ${err}`);
        return false;
    }
}

export async function generateJWT(payload){
    try{
        let token= jwt.sign(payload, JWT_SECRET)
        return token
    } catch(error){
        
        console.error(`Došlo je do greške prilikom stvaranje tokena: ${err}`);
        return false;
    }
}


export async function verifyJWT(token){
    try{
        let decoded= jwt.verify(token, JWT_SECRET, { expiresIn: '1h' })
        return decoded
    } catch(error){
        console.error(`Došlo je do greške prilikom verifikacije JWT tokena: ${err}`);
        return null;
    }
}