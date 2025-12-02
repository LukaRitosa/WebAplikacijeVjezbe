import express from 'express';
import { boats } from '../data/boats.js'
const router = express.Router();


router.get('/', (req, res)=>{
    if(boats.length==0 || !boats){
        return res.status(404).json({odgovor: 'podatci ne postoje'})
    }
    return res.status(200).json(boats)
})

router.get('/:naziv', (req, res)=>{
    let naziv_broda= normalize(req.params.naziv)

    let brod= boats.find(b => normalize(b.naziv)==naziv_broda)

    if(!brod){
        return res.status(404).json({greska: 'taj broj brod ne postoji'})
    }

    return res.status(200).json(brod)
})

router.post('/', (req, res)=>{
    let novi_brod= req.body

    let dozvoljeni_kljucevi= ["naziv", "tip", "duljina", "cijenaPoDanu", "motor_hp"]

    let kljucevi= Object.keys(novi_brod)

    let krivi_kljucevi= kljucevi.some(k => !dozvoljeni_kljucevi.includes(k))


    if(krivi_kljucevi){
        return res.status(400).json({greska: 'Krivi oblik broda'})
    }

    let isti_naziv= boats.find(b => b.naziv== novi_brod.naziv)

    if(isti_naziv){
        return res.status(400).json({greska: 'brod s tim nazivom već postoji'})
    }

    let novi_id= boats.at(-1)['id'] + 1

    boats.push({id: novi_id, ...novi_brod})

    return res.status(201).json(boats.at(-1))
})


export default router
