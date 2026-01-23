import { filmovi } from '../data/data.js'
import express from 'express';
import { nadiFilm, handelMovieValidation } from '../middleware/movies.js'
import { body, validationResult, query, param } from 'express-validator';


const router = express.Router();



router.get('/', [
    query("min_year").isInt().withMessage('min_year mora biti integer'),
    query("max_year").isInt().withMessage('max_year mora biti integer'),
    query('max_year').custom((y, { req }) => !req.query.min_year || y > req.query.min_year).withMessage('max_year mora biti veća od min_year'),
    handelMovieValidation
                ], async (req, res) => {

    const min_year = Number(req.query.min_year)
    const max_year = Number(req.query.max_year)

    let rezultat = filmovi

    if (min_year) {
        rezultat = rezultat.filter(f => f.year >= Number(min_year))
    }

    if (max_year) {
        rezultat = rezultat.filter(f => f.year <= Number(max_year))
    }
    
    if (rezultat.length!=0) {
        return res.status(200).json(rezultat);
    }

    return res.status(404).json({ message: 'Nema filmova' });
});

router.get('/:id', [param("id").isInt().withMessage('Mora biti integer'), handelMovieValidation, nadiFilm], async (req, res) => {
        return res.status(200).json(req.pronadeniFilm);
});

router.post('/', [body('title').exists().withMessage('title mora postojati'),
                  body('year').exists().withMessage('year mora postojati'),
                  body('genre').exists().withMessage('genre mora postojati'),
                  body('director').exists().withMessage('director mora postojati'),
                  handelMovieValidation], async (req, res)=>{
    
    const novi_film= req.body

    const novi_id= filmovi.at(-1)['id'] + 1

    filmovi.push({id: novi_id, ...novi_film})

    return res.status(201).json(filmovi.at(-1))
})

router.patch('/:id', [body('title').optional().notEmpty().withMessage('title mora biti popunjen'),
                  body('year').optional().notEmpty().withMessage('year mora biti popunjen'),
                  body('genre').optional().notEmpty().withMessage('genre mora biti popunjen'),
                  body('director').optional().notEmpty().withMessage('director mora biti popunjen'),
                  handelMovieValidation,
                  nadiFilm], async (req, res)=>{
    
    const novi_film= req.body

    const id_film= req.pronadeniFilm.id

    const index= filmovi.findIndex(p => p.id== id_film)

    for(const kljuc in novi_film){
        filmovi[index][kljuc]= novi_film[kljuc]
    }

    return res.status(200).json(filmovi[index])
})



export default router;
