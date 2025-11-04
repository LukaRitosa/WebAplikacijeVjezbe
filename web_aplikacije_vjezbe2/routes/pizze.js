import express from 'express';
const router = express.Router();

let pizze=[
    {
        id: 1, 
        naziv: "margerita",
        cijena: 9
    },
    {
        id: 2, 
        naziv: "mješana",
        cijena: 12
    },
    {
        id: 3, 
        naziv: "slavonska",
        cijena: 15
    },
    {
        id: 4, 
        naziv: "hawaii",
        cijena: 14
    },
    {
        id: 5, 
        naziv: "salami",
        cijena: 12
    }
]

router.get('/', (req, res)=>{
    res.json(pizze)
})

router.get('/:naziv', (req, res) => {
    const naziv_pizza= req.params.naziv

    const trazena_pizza= pizze.find(pizza => pizza.naziv == naziv_pizza)

    if(!trazena_pizza){
        return res.json({ greska: 'pizza ne postoji'}).status(404)
    }

    else return res.json(trazena_pizza).status(200)
})

router.post("/", (req, res)=>{
    const nova_pizza= req.body

    const dozvoljeni_kljucevi= ['naziv', 'cijena']

    const kljucevi_pizze=Object.keys(nova_pizza)

    const krivi_kjucevi=kljucevi_pizze.some(kljuc => !dozvoljeni_kljucevi.includes(kljuc))
    
    if(krivi_kjucevi){
        return res.status(400).json({greska: "Krivi ključeni za stvaranje pizze"})
    }
    
    const naziv_nove_pizze= req.body.naziv

    const postoji= pizze.find(pizza => pizza.naziv == naziv_nove_pizze)

    if(postoji){
        return res.status(400).json({greska: `pizza već postoji`})
    }


    let novi_id = pizze.at(-1)["id"] + 1


    pizze.push({id: novi_id, ...nova_pizza})

    return res.json(pizze).status(201) // created
})


router.put("/:id", (req, res)=>{
    const nova_pizza= req.body
    const id_pizza= req.params.id

    nova_pizza.id=id_pizza

    const index= pizze.findIndex(pizza => pizza.id == id_pizza)

    if(index==-1){
        return res.status(404).json({message: "Pizza koju želite ažurirati ne postoji"})
    }
    
    pizze[index]= nova_pizza
    return res.status(200).json(pizze[index])
})


router.patch("/:id", (req, res)=>{
    const id_pizza=req.params.id
    const nova_pizza=req.body

    nova_pizza.id=id_pizza

    const index= pizze.findIndex(p => p.id== id_pizza)

    if(index==-1){
        return res.status(404).json({greska: "Pizza koju želite ažuriratu ne postoji"})
    }

    console.log(pizze)

    for(const kljuc in nova_pizza){
        pizze[index][kljuc]= nova_pizza[kljuc]
    }

    console.log(pizze)

    return res.status(200).json(pizze[index])
})


router.delete("/:id", (req, res)=>{
    const id_pizza=req.params.id
    
    const index = pizze.findIndex(p => p.id == id_pizza)

    if(index == -1){
        return res.status(400).json({greska: "Pizza koju želite obrisati ne postoji"})
    }

    console.log(pizze)

    pizze= pizze.filter(p=> p.id != id_pizza)

    console.log(pizze)

    return res.status(204).json({uspjeh: "Pizza obrisana"})
})






export default router

