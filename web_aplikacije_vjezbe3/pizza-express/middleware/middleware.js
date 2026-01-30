import { connectToDatabase } from '../db.js'
import { verifyJWT } from '../auth.js'

let db = await connectToDatabase();



export const nadiKorisnika= async (req, res, next)=>{
    let korisnik= req.body

    let user_collection= db.collection('users')

    let postoji= await user_collection.findOne({ime: korisnik.ime})

    if(postoji){
        req.user=postoji
        return next()
    }

    return next()

}

export const imeKorisnika= async (req, res, next)=>{
    const header= req.headers.authorization

    if(!header){
        return res.status(404).json({greska: 'nema jwt-a u headeru'})
    }

    let token= header.split(' ')[1]

    const decoded= await verifyJWT(token)

    if(!decoded) {
        return res.status(401).json({ greska: 'Neispravan token' })
    }

    req.user = decoded
    next()
}