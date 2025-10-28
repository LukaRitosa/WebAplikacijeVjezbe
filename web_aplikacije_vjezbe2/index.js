import express from 'express'
let port = 3000
let app= express()

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

app.get('/', (req, res) =>{
    console.log('pozvana GET ruta')
    res.send('ćao')
})

app.get('/pizze', (req, res) =>{
    res.json.pizze
})

app.get('/pizze/:naziv', (req, res)=>{
    let naziv_pizze= req.params.naziv
    console.log('trežim pizzu:', naziv_pizze)
    res.json.pizze
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



/*

bitno za zapamtit


find
findIndex
map, filter, reduce 
splice, slice
some, every


*/