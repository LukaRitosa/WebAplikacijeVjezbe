import { hashPassword, checkPassword, generateJWT, verifyJWT } from '../auth.js';
import { users } from '../data/users.js'

export const pronadiKorisnika= (req, res, next)=>{
    let user= users.find(k=>k.username===req.body.username)

    if(user){
        req.user= user
        return next()
    }
    return next()
}

export const authMiddleware= async (req, res, next)=>{
    let token= req.headers.authorization.split(' ')[1]

    let decoded= await verifyJWT(token)

    if(!decoded){
        return res.status(401).send('nevaljani JWT')
    }

    req.autorizirani_korisnik= decoded
    next()
}