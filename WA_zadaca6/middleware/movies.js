
import { filmovi } from '../data/data.js'
import { validationResult } from 'express-validator'


// export const validirajEmail= (req, res, next)=>{
//     if (req.body.email && typeof req.body.email === 'string') {
//         return next()
//     } 
//     else{
//         return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' })
//     }
// }

export const nadiFilm= (req, res, next)=>{
    const id_route_param = parseInt(req.params.id);
    const film = filmovi.find(f => f.id === id_route_param);
    if(film){
        req.pronadeniFilm= film
        return next()
    }
    else{
        return res.status(404).json({message: 'Film nije pronaden'})
    }
}


export const handelMovieValidation= (req, res, next)=>{
    const error= validationResult(req)
    
        if(error.isEmpty()){
            return next()
        } else{
            return res.status(400).json({greska: error.array()})
        }
}