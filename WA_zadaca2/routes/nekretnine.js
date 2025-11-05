import express from 'express';
const router = express.Router();

const nekretnine = [
  {
    id: 1,
    naziv: "Stan u centru Zagreba",
    opis: "Moderan stan u blizini glavnog trga, potpuno namješten s balkonom i pogledom na grad.",
    cijena: 250000,
    lokacija: "Zagreb, Donji grad",
    broj_soba: 3,
    povrsina: 85
  },
  {
    id: 2,
    naziv: "Kuća s bazenom u Splitu",
    opis: "Luksuzna kuća s bazenom i okućnicom, udaljena 5 minuta od plaže.",
    cijena: 480000,
    lokacija: "Split, Meje",
    broj_soba: 5,
    povrsina: 180
  },
  {
    id: 3,
    naziv: "Garsonijera u Osijeku",
    opis: "Kompaktna garsonijera idealna za studente ili samce, blizu kampusa.",
    cijena: 60000,
    lokacija: "Osijek, Retfala",
    broj_soba: 1,
    povrsina: 30
  },
  {
    id: 4,
    naziv: "Vikendica na Plitvicama",
    opis: "Drvena vikendica u prirodi, idealna za odmor i iznajmljivanje turistima.",
    cijena: 150000,
    lokacija: "Plitvička jezera",
    broj_soba: 4,
    povrsina: 95
  },
  {
    id: 5,
    naziv: "Stan u novogradnji u Rijeci",
    opis: "Prostran stan s pogledom na more, u modernoj zgradi s liftom i garažom.",
    cijena: 210000,
    lokacija: "Rijeka, Pećine",
    broj_soba: 3,
    povrsina: 78
  }
]


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

  
})

export default router

