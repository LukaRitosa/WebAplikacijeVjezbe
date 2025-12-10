import express from 'express'
import fs from 'fs/promises'

const app = express()

function read_file(callback){
    fs.readFile('./data/lorem_ipsum.txt', "utf-8", callback)
}

app.get('/story', (req, res) => {
    read_file ((error, data)=>{
        if(error){
            return res.status(404).send(`Greška u čitanju datoteke`)
        }
        return res.status(200).json(data)
    })
})

app.get('/storyPromise', async (req, res)=>{
    try{
        let data= await fs.readFile('./data/lorem_ipsum.txt', "utf-8")
        res.status(200).send(data)
    }
    catch(error){
        res.status(400).send("Greška")
    }
})

app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na portu 3000');
})