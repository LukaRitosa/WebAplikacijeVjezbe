import express from 'express'
import path from 'path'

const poruke=[
    { id: 1, posiljatelj: 'Ana', sadrzaj: 'Pozdrav!' },
    { id: 2, posiljatelj: 'Ivan', sadrzaj: 'Bok!' },
    { id: 3, posiljatelj: 'Mate', sadrzaj: 'Ćao!' },
    { id: 4, posiljatelj: 'Jana', sadrzaj: 'Hello!' },
    { id: 5, posiljatelj: 'Maja', sadrzaj: 'Hi!' }
];


let port = 3000
let app= express()

app.use(express.json())

app.get('/luka/ritosa', (req, res)=>{
    let ime_prezime={ime: 'Luka', prezime: 'Ritoša', jmbag: "0303115039"}

    return res.status(200).json(ime_prezime)
})

app.get('/poruke', (req, res)=>{
    return res.status(200).json(poruke)
})

app.get('/poruke/:id', (req, res)=>{
    let id_poruka=req.params.id
    
    let poruka= poruke.find(p => p.id== id_poruka)

    if(!poruka){
        return res.status(200).json({greska: `Ne postoji poruka s id-em ${id_poruka}`})
    }

    return res.status(200).json(poruka)
})

app.post('/poruke', (req, res)=>{
    let nova_poruka= req.body

    let dozvoljeni_kljucevi= ['posiljatelj', 'sadrzaj']

    let kljucevi=Object.keys(nova_poruka)

    let krivi_kljucevi=kljucevi.some(k=> !dozvoljeni_kljucevi.includes(k))

    if(krivi_kljucevi){
        if(kljucevi.includes('id')){
            return res.status(400).json({greska: 'Id nesmije biti u tijelu zahtjeva'})
        }
        return res.status(400).json({greska: 'Neispravan oblik'})
    }

    let novi_id= poruke.at(-1)['id'] + 1

    poruke.push({id: novi_id, ...nova_poruka})

    return res.status(201).json(poruke.at(-1))
})

app.listen(port, (error)=>{
    if(error){
        console.error('Ne radi startanje')
    }
    else{
        console.error(`Posložitelj sluša na ${port}`)
    }
})

console.log(app)



