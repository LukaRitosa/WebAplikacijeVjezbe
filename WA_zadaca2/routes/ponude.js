import express from 'express'
import { nekretnine, ponude } from './data.js'
const router = express.Router()



router.post('/', (req, res)=>{
  const nova_ponuda= req.body


  const dozvoljeni_kljucevi= ['id_nekretnine', 'ime', 'prezime', 'ponudjena_cijena', 'telefon']

  const kljucevi_ponuda=Object.keys(nova_ponuda)

  const krivi_kjucevi=kljucevi_ponuda.some(kljuc => !dozvoljeni_kljucevi.includes(kljuc))

  if(krivi_kjucevi || nova_ponuda.ponudjena_cijena <0 || isNaN(nova_ponuda.ponudjena_cijena)){
        
    return res.status(400).json({greska: 'Ne možete u ovom obliku stvoriti ponudu'})
  }


  const index=nekretnine.findIndex(i => i.id == nova_ponuda.id_nekretnine)


  if(index==-1){
    return res.status(404).json({greska: `Nekretnina sa id-em ${nova_ponuda.id_nekretnine} ne postoji`})
  }
  
  let novi_id= ponude.at(-1)['id'] +1 

  ponude.push({id: novi_id, ... nova_ponuda})

  return res.status(201).json(ponude)
})

export default router

