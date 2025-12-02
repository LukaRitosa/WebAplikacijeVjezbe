import express from 'express';
import { najmi } from '../data/najam.js'
import { boats } from '../data/boats.js'
import { razlikaDana } from '../utils/funkcije.js'
const router = express.Router();




router.post('/', (req, res)=>{
    let novi_najam= req.body
    
    let dozvoljeni_kljucevi= ["boatId", "customerName", "rentalStartDate", "rentalEndDate"]

    let krivi_kljucevi= Object.keys(novi_najam).some(k => !dozvoljeni_kljucevi.includes(k))

    if(krivi_kljucevi){
        return res.status(400).json({greska: 'Krivi oblik najma'})
    }

    if(new Date(novi_najam.rentalStartDate)> new Date(novi_najam.rentalEndDate)){
        return res.status(400).json({greska: 'Najam ne može završiti prije nego je počeo'})
    }

    let trajanje_najma= razlikaDana(novi_najam.rentalStartDate, novi_najam.rentalEndDate)

    let brod= boats.find(b => b.id==novi_najam.boatId)

    if(!brod){
        return res.status(404).json({greska: 'brod koji pokušavate iznajmiti ne postoji'})
    }

    let cijena_najma= brod.cijenaPoDanu * trajanje_najma

    let novi_id= najmi.at(-1)['id'] + 1

    najmi.push({
        id: novi_id,
        ...novi_najam,
        totalPrice: cijena_najma
    })

    return res.status(201).json(najmi.at(-1))
})

router.patch('/:id', (req, res)=>{
    let id_najam= req.params.id
    let novi_pocetak=req.body.rentalStartDate
    let novi_kraj= req.body.rentalEndDate

    let trazeni_najam= najmi.findIndex(n => n.id==id_najam)

    if(trazeni_najam==-1){
        return res.status(404).json({greska: 'Traženi najam ne postoji'})
    }

    if(new Date(novi_pocetak)> new Date(novi_kraj)){
        return res.status(400).json({greska: 'Najam ne može završiti prije nego je počeo'})
    }

    let trajanje_najma= razlikaDana(novi_pocetak, novi_kraj)

    let brod_id= najmi[trazeni_najam].boatId
    let brod= boats.find(b => b.id==brod_id) 

    let nova_cijena= trajanje_najma *  brod.cijenaPoDanu

    najmi[trazeni_najam].rentalStartDate= novi_pocetak
    najmi[trazeni_najam].rentalEndDate= novi_kraj
    najmi[trazeni_najam].totalPrice= nova_cijena

    return res.status(200).json(najmi[trazeni_najam])
})


export default router
