import express from 'express'
import fs from 'fs/promises'
// import fs from 'fs';
// import fs from 'fs-extra';


const app = express()

app.use(express.json())

let student_pero = {
    ime: 'Pero',
    prezime: 'Perić',
    godine: 20,
    fakultet: 'FIPU'
};

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

async function write_data(data) {
    try {
        await fs.writeFile('data/write.txt', data, { encoding:'utf8', flag: 'a'});
        console.log('Podaci uspješno zapisani u datoteku.');
        return true;
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        return false;
    }
}

app.get('/write', async (req, res) => {
    const data = 'Najnovije.';
    const success = await write_data(data);
    if (success) {
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } else {
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});



app.get('/write-callback', (req, res) => {
    const string = 'Ovo je tekst koji smo pohranili asinkrono u datoteku kroz Callback pattern i w flag.';
    // flag je `w`, dakle svaki put ćemo zamijeniti sadržaj datoteke
    fs.writeFile('data/text.txt', string, { encoding: 'utf8', flag: 'w' }, err => {
        if (err) {
            console.error('Greška prilikom pohrane u datoteku:', err);
            res.status(500).send('Greška prilikom pohrane u datoteku.');
        } else {
            console.log('Podaci uspješno zapisani u datoteku.');
            res.status(200).send('Podaci uspješno zapisani u datoteku.');
        }
    });
});

app.get('/append-promise', async (req, res) => {
  const string = 'Ovo je tekst koji smo pohranili asinkrono u datoteku kroz Promise pattern i a flag.';
  // flag je `a`, dakle svakim pozivom ćemo dodati sadržaj na kraj datoteke
  try {
    await fs.writeFile('data/text.txt', string, { encoding: 'utf8', flag: 'a' });
    console.log('Podaci uspješno zapisani u datoteku.');
    res.status(200).send('Podaci uspješno zapisani u datoteku.');
  } catch (error) {
    console.error('Greška prilikom pohrane u datoteku:', error);
    res.status(500).send('Greška prilikom pohrane u datoteku.');
  }
});

// import fs from 'fs';
app.get('/write-json-callback', (req, res) => {
    // flag je defaultni `w`, dakle svaki put ćemo zamijeniti sadržaj datoteke. Serijalizacija kroz JSON.stringify()
    fs.writeFile('data/data.json', JSON.stringify(student_pero), err => {
        if (err) {
            console.error('Greška prilikom pohrane u datoteku:', err);
            res.status(500).send('Greška prilikom pohrane u datoteku.');
        } else {
            console.log('Podaci uspješno zapisani u datoteku.');
            res.status(200).send('Podaci uspješno zapisani u datoteku.');
        }
    });
});

app.get('/write-json-promise', async (req, res) => {
    // flag je defaultni `w`, dakle svaki put ćemo zamijeniti sadržaj datoteke. Serijalizacija kroz JSON.stringify()
    try {
        await fs.writeFile('data/data.json', JSON.stringify(student_pero));
        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});


app.post('/student', async (req, res) => {
    const student = req.body;

    if (Object.keys(student).length === 0) {
        return res.status(400).send('Niste poslali podatke.');
    }

    try {
        await fs.writeFile('data/data.json', JSON.stringify(student));
        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});




// app.put('/student', async (req, res) => {
//     const student = req.body;

//     if (Object.keys(student).length === 0) {
//         return res.status(400).send('Niste poslali podatke.');
//     }

//     try {
//         // pročitaj datoteku
//         const data = await fs.readFile('data/data.json', 'utf8');
//         // deserijaliziraj JSON podatke
//         const students = JSON.parse(data);
//         // dodaj novog studenta
//         students.push(student);
//         // serijaliziraj i pohrani
//         await fs.writeFile('data/data.json', JSON.stringify(students));
//         console.log('Podaci uspješno zapisani u datoteku.');
//         res.status(200).send('Podaci uspješno zapisani u datoteku.');
//     } catch (error) {
//         console.error('Greška prilikom pohrane u datoteku:', error);
//         res.status(500).send('Greška prilikom pohrane u datoteku.');
//     }
// });

app.put('/student', async (req, res) => {
    const student = req.body;

    if (Object.keys(student).length === 0) {
        return res.status(400).send('Niste poslali podatke.');
    }

    try {
        // pročitaj datoteku, deserijaliziraj JSON podatke i pohrani u varijablu
        const students = await fs.readJson('data/data.json');
        students.push(student);
        await fs.writeJson('data/data.json', students); // serijaliziraj i pohrani u datoteku

        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});

// u definiciji endpointa NIŠTA NE MIJENJAMO!
// app.get('/students', async (req, res) => {
//     let fakultet_query = req.query.fakultet; // dohvatimo query parametar 'fakultet'
//     let godine_query = req.query.godine;

//     try {
//         const data = await fs.readFile('data/students.json', 'utf8');
//         const students = JSON.parse(data);

//         if (fakultet_query && godine_query) {
//             const filtered_students = students.filter(student => student.fakultet === fakultet_query && student.godine==godine_query);
//             res.status(200).send(filtered_students);
//             // ako ne postoji query parametar, vrati sve studente
//         }else if(godine_query){
//             const filtered_students = students.filter(student => student.godine==godine_query);
//             res.status(200).send(filtered_students);
//         }else if(fakultet_query){
//             const filtered_students = students.filter(student => student.fakultet === fakultet_query);
//             res.status(200).send(filtered_students);
//         } else {
//             res.status(200).send(students);
//         }
//     } catch (error) {
//         console.error('Greška prilikom čitanja datoteke:', error);
//         res.status(500).send('Greška prilikom čitanja datoteke.');
//     }
// });

app.get('/students', async (req, res) => {
    let sortiraj_po_godinama = req.query.sortiraj_po_godinama; // dohvatimo vrijednost query parametar 'sortiraj_po_godinama'
    try {
        const data = await fs.readFile('data/students.json', 'utf8');
        const students = JSON.parse(data);
        // ako je prisutan query parametar 'sortiraj_po_godinama', sortiraj studente
        if (sortiraj_po_godinama) {
            if (sortiraj_po_godinama === 'uzlazno') {
                // sortiranje uzlazno: od najmanjeg prema najvećem
                students.sort((a, b) => a.godine - b.godine);
                // sortiranje silazno: od najvećeg prema najmanjem
            } else if (sortiraj_po_godinama === 'silazno') {
                students.sort((a, b) => b.godine - a.godine);
            }
        }

        res.status(200).send(students);
    } catch (error) {
        console.error('Greška prilikom čitanja datoteke:', error);
        res.status(500).send('Greška prilikom čitanja datoteke.');
    }
})



app.listen(3000, () => {
  console.log('Poslužitelj je pokrenut na portu 3000');
})