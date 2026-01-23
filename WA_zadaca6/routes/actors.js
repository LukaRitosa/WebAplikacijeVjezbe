import { glumci } from '../data/data.js'
import express from 'express';
import { nadiGlumca, handelActorValidation } from '../middleware/actors.js'
import { body, validationResult, query, param } from 'express-validator';


const router = express.Router();



router.get('/', [query('name').trim().isString().withMessage('name mora biti slovima') ,handelActorValidation], async (req, res) => {    
    const name = req.query.name

    let rez= glumci

    if(name){
        rez= rez.filter(g=>g.name==name)
    }

    if (rez.length!==0) {
        return res.status(200).json(rez);
    }
    return res.status(404).json({ message: 'Nema glumaca' });
});

router.get('/:id', [param("id").isInt().withMessage('Mora biti integer'), handelActorValidation, nadiGlumca], async (req, res) => {
        return res.status(200).json(req.pronadeniGlumac);
});

router.post('/', [body('name').exists().withMessage('name mora postojati'),
                  body('birthYear').exists().withMessage('birthYear mora postojati'),
                  handelActorValidation], async (req, res)=>{
    const novi_glumac= req.body

    const novi_id= glumci.at(-1)['id'] + 1

    glumci.push({id: novi_id, ...novi_glumac})

    return res.status(201).json(glumci.at(-1))
})

router.patch('/:id', [body('name').optional().notEmpty().withMessage('name mora biti popunjen'),
                  body('birthYear').optional().notEmpty().withMessage('birthYear mora biti popunjen'),
                  handelActorValidation,
                  nadiGlumca], async (req, res)=>{
    const novi_glumac= req.body

    const id_glumac=req.pronadeniGlumac.id

    novi_glumac.id=id_glumac

    const index= glumci.findIndex(p => p.id== id_glumac)

    for(const kljuc in novi_glumac){
        glumci[index][kljuc]= novi_glumac[kljuc]
    }

    return res.status(201).json(glumci[index])
})



export default router;
