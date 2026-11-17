// ==============================================================================
// SERVER.JS - EXPRESS ETA MONGODB ZERBITZARIA (APIa)
// ==============================================================================

// 1. Beharrezko liburutegiak inportatu 
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

// 2. Express aplikazioa sortu. Gure web zerbitzaria. 
const app = express();

// 3. MIDDLEWARE-ak konfiguratu. Express-i esaten zaio eskaera guztiak cors() eta express.json() iragazkietatik igaro behar direla.
app.use(cors());
app.use(express.json());

// 4. KONFIGURAZIOAK
const PORT = 5000;                              // Zerbitzariak entzungo duen portua
const MONGO_URI = "mongodb://127.0.0.1:27017";  // Gure ordenagailuko MongoDB lokalaren helbidea

// 5. MONGODB KONEXIOA
const client = new MongoClient(MONGO_URI);
let db; // Datu-basearen konexioa hemen gordeko dugu globalki

async function connectDB() {
  try {
    await client.connect();         // MongoDB-rekin konektatu (itxaron egin behar dugu)
    db = client.db("liburuak");  // Zure datu-basearen izena
    console.log("MongoDB konektatuta!");
  } catch (err) {
    console.error("Errorea MongoDB-rekin konektatzean:", err);
  }
}

// Zerbitzaria kargatzean datu-basearekin konektatzen gara
connectDB();

// 6. ENDPOINT / BIDEA: GET /liburuak
// Nabigatzaileak edo frontend-ak '/liburuak' helbidean eskaera bat egiten duenean exekutatzen da
async function lortuLiburuak(req, res) {
  try {
    // Datu-basera joan eta 'liburuak' bildumako dokumentu GUZTIAK lortu zerrenda batean (Array)
    const liburuak = await db.collection("liburutegia").find({}).toArray();
    
    // Liburuak JSON formatuan bueltatu eskaera egin duenari (Frontend-ari)
    res.json(liburuak);

  } catch (err) {
    // Arazoren bat badago, 500 errorea eta mezua bidali
    res.status(500).json({ error: err.message });
  }
}
// Orain, Express-i esaten diogu '/liburuak' bidera GET eskaera bat datorrenean gure funtzioa exekutatzeko
//app.get("/liburuak", lortuLiburuak);

async function getUrtea(req, res) {
  try {

    
    // Datu-basera joan eta 'liburuak' bildumako dokumentu GUZTIAK lortu zerrenda batean (Array)
    const liburuak = await db.collection("liburutegia").find({argitalpen_urtea : 1898}).toArray();
    
    // Liburuak JSON formatuan bueltatu eskaera egin duenari (Frontend-ari)
    res.json(liburuak);

  } catch (err) {
    // Arazoren bat badago, 500 errorea eta mezua bidali
    res.status(500).json({ error: err.message });
  }
}

app.get("/liburuak/urtea/1898", getUrtea);

// 7. ZERBITZARIA MARTXAN JARRI
/*function abisuaEman() {
  console.log("Server-a martxan: http://localhost:" + PORT + "/liburuak" );
}*/

function liburuUrteak() {
  console.log("Server-a martxan: http://localhost:" + PORT + "/liburuak/urtea/1898");
}
// app.listen() metodoak zerbitzaria entzuten jartzen du.
// Bi parametro pasatzen dizkiogu:
// 1. PORT (5000): Zein atetik entzun behar duen.
// 2. abisuaEman: Zerbitzaria piztutakoan exekutatuko den funtzioaren izena.
app.listen(PORT, liburuUrteak);