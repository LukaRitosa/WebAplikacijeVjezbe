import express from 'express'
import fs from 'fs/promises'
// import fs from 'fs';
// import fs from 'fs-extra';


const app = express()

app.use(express.json())


app.get('/zaposlenici', async(req, res)=>{
  let sortiraj_po_godinama= req.query.sortiraj_po_godinama
  let pozicija= req.query.pozicija 
  let godine_staza_trajanje= req.query.godine_staza_trajanje 

  try{
    const data= await fs.readFile('./data/zaposlenici.json', 'utf8')
    const zaposlenici= JSON.parse(data)

    if(pozicija && godine_staza_trajanje){
      const filtrirani_zaposlenici= zaposlenici.filter(z=> z.pozicija==pozicija)
      
      if (godine_staza_trajanje === 'min') {
          filtrirani_zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza)
          return res.status(200).send(filtrirani_zaposlenici.at(0))
      } else if (godine_staza_trajanje === 'max') {
          filtrirani_zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza)
          return res.status(200).send(filtrirani_zaposlenici.at(0))
      }
    }
    else if(sortiraj_po_godinama && pozicija){
      const filtrirani_zaposlenici= zaposlenici.filter(z=> z.pozicija==pozicija)

      if (sortiraj_po_godinama === 'uzlazno') {
          filtrirani_zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza)
      } else if (sortiraj_po_godinama === 'silazno') {
          filtrirani_zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza)
      }

      return res.status(200).send(filtrirani_zaposlenici)
    }
    else if(sortiraj_po_godinama){
      if (sortiraj_po_godinama === 'uzlazno') {
          zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza)
      } else if (sortiraj_po_godinama === 'silazno') {
          zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza)
      }

      return res.status(200).send(zaposlenici)
    }
    else if(pozicija){
      const filtrirani_zaposlenici= zaposlenici.filter(z=> z.pozicija==pozicija)

      return res.status(200).send(filtrirani_zaposlenici)
    }
    else if(godine_staza_trajanje){
      if (godine_staza_trajanje === 'min') {
          zaposlenici.sort((a, b) => a.godine_staza - b.godine_staza)
          return res.status(200).send(zaposlenici.at(0))
      } else if (godine_staza_trajanje === 'max') {
          zaposlenici.sort((a, b) => b.godine_staza - a.godine_staza)
          return res.status(200).send(zaposlenici.at(0))
      }
    }
    else{
      return res.status(200).send(zaposlenici)
    }
  } catch(error){
    console.error('Greška prilikom čitanja datoteke:', error);
    res.status(500).send('Greška prilikom čitanja datoteke.');}
})

app.get('/zaposlenici/:id', async(req, res)=>{
  try{
    const data= await fs.readFile('./data/zaposlenici.json', 'utf8')
    const zaposlenici= JSON.parse(data)

    const id_zaposlenik=req.params.id

    const postoji= zaposlenici.find(z=> z.id==id_zaposlenik)

    if(!postoji){
      return res.status(404).json({greska: `Zaposlenik sa id-em ${id_zaposlenik} ne postoji`})
    }

    return res.status(200).send(postoji)
  
  } catch(error){
    console.error('Greška prilikom čitanja datoteke:', error);
    res.status(500).send('Greška prilikom čitanja datoteke.');
  }
})


app.post('/zaposlenici', async (req, res)=>{
  const zaposlenik=req.body

  const dozvoljeni_kljucevi=["ime", "prezime", "godine_staza", "pozicija"]

  const kljucevi=Object.keys(zaposlenik)

  if (kljucevi.length === 0) {
      return res.status(400).send('Niste poslali podatke.');
  }

  const krivi_kljucevi= kljucevi.some(k=> !dozvoljeni_kljucevi.includes(k))

  if(krivi_kljucevi){
    return res.status(400).json({greska: 'Krivi oblik podataka'})
  }

  if(typeof zaposlenik.ime !=='string' || typeof zaposlenik.prezime !=='string' || typeof zaposlenik.godine_staza !=='number' || typeof zaposlenik.pozicija !=='string'){
    return res.status(400).json({greska: 'Kriva vrsta podataka'})
  }

  try{
    const data= await fs.readFile('./data/zaposlenici.json', 'utf8')
    const zaposlenici= JSON.parse(data)

    const novi_id= zaposlenici.at(-1)["id"] + 1

    const novi_zaposlenik={
      id: novi_id,
      ...zaposlenik
    }

    zaposlenici.push(novi_zaposlenik)
    
    await fs.writeFile('data/zaposlenici.json', JSON.stringify(zaposlenici), 'utf8')
    console.log('Podaci uspješno zapisani u datoteku.')

    return res.sendStatus(201).send(zaposlenici.at(-1))

  } catch(error){
    console.error('Greška prilikom pisanja datoteke:', error)
    res.status(500).send('Greška prilikom pisanja datoteke.')
  }
})

app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na portu 3000');
})