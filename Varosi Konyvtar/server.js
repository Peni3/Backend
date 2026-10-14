const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

const konyvek = [
    { id: 1, cim: "Egri csillagok", szerzo: "Gárdonyi Géza", ev: 1899 },
    { id: 2, cim: "A Pál utcai fiúk", szerzo: "Molnár Ferenc", ev: 1906 },
    { id: 3, cim: "Tüskevár", szerzo: "Fekete István", ev: 1957 },
    { id: 4, cim: "Arany ember", szerzo: "Jókai Mór", ev: 1872 }
];

app.use((req, res, next) => {
    const ido = new Date().toLocaleTimeString("hu-HU");
    console.log(`[${ido}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send(`
        <h1>Városi Könyvtár Infó Szerver</h1>
        <p>Elérhető API végpontok:</p>
        <ul>
            <li><a href="/api/konyvtar">Könyvtár infó (/api/konyvtar)</a></li>
            <li><a href="/api/konyvek">Összes könyv (/api/konyvek)</a></li>
            <li><a href="/api/nyitvatartas">Nyitvatartás (/api/nyitvatartas)</a></li>
            <li><a href="/info.html">Statikus infó oldal (/info.html)</a></li>
        </ul>
    `);
});

app.get("/api/konyvtar", (req, res) => {
    res.json({
        nev: "Városi Központi Könyvtár",
        cim: "1051 Budapest, Könyvtár utca 10.",
        nyitasEve: 1920
    });
});

app.get("/api/konyvek", (req, res) => {
    res.json(konyvek);
});

app.get("/api/nyitvatartas", (req, res) => {
    res.json({
        napiOrak: 8,
        hetiNapok: 5,
        hetiOrak: 40
    });
});

app.get("/api/konyvek/:id", (req, res) => {
    const id = Number(req.params.id);
    const konyv = konyvek.find(k => k.id === id);

    if (!konyv) {
        return res.status(404).json({ hiba: "Nincs ilyen könyv" });
    }
    res.json(konyv);
});

app.get("/api/konyvek/szerzo/:nev", (req, res) => {
    const keresettSzerzo = req.params.nev.toLowerCase();
    const talalatok = konyvek.filter(k => k.szerzo.toLowerCase().includes(keresettSzerzo));
    res.json(talalatok);
});


app.use((req, res) => {
    res.status(404).json({
        hiba: "Nincs ilyen végpont",
        utvonal: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Szerver elindult a http://localhost:${PORT} címen.`);
});