const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const dojoAdat = {
    nev: "Főnix Karate Dojo",
    varos: "Budapest",
    alapitasEve: 2010,
    stilus: "Kyokushin"
};

const edzok = [
    { id: 1, nev: "Sensei Kovács János", fokozat: "3. dan" },
    { id: 2, nev: "Senpai Szabó Anna", fokozat: "1. dan" },
    { id: 3, nev: "Sensei Tóth Péter", fokozat: "4. dan" }
];

const edzesek = [
    { id: 1, nap: "hétfő", kezdes: "17:00", csoport: "gyerek", edzoId: 1 },
    { id: 2, nap: "hétfő", kezdes: "18:30", csoport: "felnőtt", edzoId: 3 },
    { id: 3, nap: "szerda", kezdes: "17:00", csoport: "gyerek", edzoId: 1 },
    { id: 4, nap: "szerda", kezdes: "18:30", csoport: "felnőtt", edzoId: 2 },
    { id: 5, nap: "péntek", kezdes: "18:00", csoport: "felnőtt", edzoId: 3 }
];

app.use((req, res, next) => {
    const idopont = new Date().toLocaleString('hu-HU');
    console.log(`[${idopont}] ${req.method} ${req.originalUrl}`);
    next(); // Továbbengedi a kérést a következő végpontra
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(`
        <h1>Üdvözöllek a Karate Dojo Infó Szerveren!</h1>
        <p>Elérhető végpontok:</p>
        <ul>
            <li><a href="/api/dojo">Dojo adatai (/api/dojo)</a></li>
            <li><a href="/api/edzok">Edzők listája (/api/edzok)</a></li>
            <li><a href="/api/edzesek">Összes edzés (/api/edzesek)</a></li>
            <li><a href="/api/edzesek?csoport=gyerek">Gyerek edzések (/api/edzesek?csoport=gyerek)</a></li>
            <li><a href="/api/statisztika">Statisztika (/api/statisztika)</a></li>
            <li><a href="/orarend.html">Órarend (Statikus oldal)</a></li>
        </ul>
    `);
});

app.get('/api/dojo', (req, res) => {
    res.json(dojoAdat);
});

app.get('/api/edzok', (req, res) => {
    res.json(edzok);
});

app.get('/api/edzesek', (req, res) => {
    const { csoport, nap } = req.query;
    let szurtEdzesek = [...edzesek];

    if (csoport) {
        szurtEdzesek = szurtEdzesek.filter(e => e.csoport.toLowerCase() === csoport.toLowerCase());
    }
    if (nap) {
        szurtEdzesek = szurtEdzesek.filter(e => e.nap.toLowerCase() === nap.toLowerCase());
    }

    res.json(szurtEdzesek);
});

app.get('/api/edzesek/:id', (req, res) => {
    const edzesId = parseInt(req.params.id);
    const edzes = edzesek.find(e => e.id === edzesId);

    if (!edzes) {
        return res.status(404).json({ hiba: `Nincs edzés ezzel az azonosítóval: ${edzesId}` });
    }

    const edzo = edzok.find(e => e.id === edzes.edzoId);
    
    const valasz = {
        ...edzes,
        edzoNeve: edzo ? edzo.nev : "Ismeretlen edző"
    };

    res.json(valasz);
});

app.get('/api/statisztika', (req, res) => {
    const edzokSzama = edzok.length;
    const hetiEdzesek = edzesek.length;
    const edzesHossza = 90; // Fix érték a feladat alapján
    const hetiPercek = hetiEdzesek * edzesHossza;

    res.json({
        edzokSzama,
        hetiEdzesek,
        edzesHossza,
        hetiPercek
    });
});

app.use((req, res) => {
    res.status(404).json({
        hiba: "Nincs ilyen végpont",
        utvonal: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`A Karate Dojo szerver fut a http://localhost:${PORT} címen.`);
});