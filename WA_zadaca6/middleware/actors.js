
import { glumci } from '../data/data.js'
import { validationResult } from 'express-validator'


// export const validirajEmail= (req, res, next)=>{
//     if (req.body.email && typeof req.body.email === 'string') {
//         return next()
//     } 
//     else{
//         return res.status(400).json({ message: 'Neispravna struktura tijela zahtjeva' })
//     }
// }

export const nadiGlumca= (req, res, next)=>{
    const id_route_param = parseInt(req.params.id);
    const glumac = glumci.find(g => g.id === id_route_param);
    if(glumac){
        req.pronadeniGlumac= glumac
        return next()
    }
    else{
        return res.status(404).json({message: 'Glumac nije pronaden'})
    }
}


export const handelActorValidation= (req, res, next)=>{
    const error= validationResult(req)
    
        if(error.isEmpty()){
            return next()
        } else{
            return res.status(400).json({greska: error.array()})
        }
}