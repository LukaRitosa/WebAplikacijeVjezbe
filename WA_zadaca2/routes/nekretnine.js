import express from 'express';
import { nekretnine } from './data.js'
const router = express.Router();



router.get('/', (req, res)=>{
    res.status(200).json(nekretnine)
})

router.get('/:id', (req, res)=>{
    const id_nekretnina=req.params.id
    
    const nekretnina= nekretnine.find( n=> n.id == id_nekretnina)

    if(!nekretnina){
        return res.status(401).json({greska: `Ne postoji nekretnina sa id-om ${id_nekretnina}`})
    }

    return res.status(200).json(nekretnina)
})

router.post('/', (req, res)=>{
    const nova_nekretnina=req.body

    const dozvoljeni_kljucevi= ['naziv', 'opis', 'cijena', 'lokacija', 'broj_soba', 'povrsina']

    const kljucevi_nekretnina=Object.keys(nova_nekretnina)

    const krivi_kjucevi=kljucevi_nekretnina.some(kljuc => !dozvoljeni_kljucevi.includes(kljuc))
    
    if(krivi_kjucevi || nova_nekretnina.broj_soba <0
      || nova_nekretnina.cijena <0 || nova_nekretnina.povrsina <0
      || isNaN(nova_nekretnina.broj_soba) || isNaN(nova_nekretnina.cijena)
      || isNaN(nova_nekretnina.povrsina)){
        return res.status(400).json({greska: 'Ne možete u ovom obliku stvoriti nekretninu'})
    }



    let novi_id=nekretnine.at(-1)['id'] + 1

    nekretnine.push({id: novi_id, ... nova_nekretnina})

    return res.status(201).json(nekretnine)

})

router.put('/:id', (req, res)=>{
  const id_nekretnina= req.params.id
  const nova_nekretnina=req.body

  nova_nekretnina.id=id_nekretnina

  const index=nekretnine.findIndex(n => n.id == id_nekretnina)

  if(index==-1){
    return res.status(404).json({greska: 'Nije pronađena nekretnina koju pokušavate ažurirati'})
  }

  nekretnine[index]=nova_nekretnina

  if(nova_nekretnina.broj_soba <0 || nova_nekretnina.cijena <0 
    || nova_nekretnina.povrsina <0 || isNaN(nova_nekretnina.broj_soba) || isNaN(nova_nekretnina.cijena)
    || isNaN(nova_nekretnina.povrsina)){
      return res.status(400).json({greska: 'Neispravan oblik nekretnine'})
    }

  return res.status(200).json({nekretnine})
})

router.patch('/:id', (req, res)=>{
  const id_nekretnina=req.params.id
  const nova_nekretnina= req.body

  const index=nekretnine.findIndex(i => i.id == id_nekretnina)

  if(index == -1){
    return res.status(404).json({greska: 'ne postoji nekretnina koju pokušavate ažurirati'})
  }

  for(const k in nova_nekretnina){
    nekretnine[index][k]= nova_nekretnina[k]
  }

  return res.status(200).json(nekretnine)
  
})

router.delete('/:id', (req, res)=>{
  const id_nekretnina= req.params.id

  const index= nekretnine.findIndex(n=> n.id == id_nekretnina)

  if(index==-1){
    return res.status(404).json({greska: 'Nije pronađena nekretnina koju pokužavate obrisati'})
  }

  console.log(nekretnine)

  nekretnine= nekretnine.filter(n=> n.id!=id_nekretnina)

  console.log(nekretnine)

  return res.status(204).json({odgovor: 'obrisano'})
})


export default router
