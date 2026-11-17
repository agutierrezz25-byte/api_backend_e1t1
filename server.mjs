
// -------------------------------
// Inportazioak
// -------------------------------
import express from "express";
import cors from "cors";

import { konektatuDB } from "./konexioa.mjs";

import bezeroRoutes from "./bezero.mjs";
import langileRoutes from "./langile.mjs";
import crudOperazioak from "./crud.mjs";


// -------------------------------
// Express aplikazioa sortu
// -------------------------------
const app = express();


// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(express.json());


// -------------------------------
// Konfigurazioa
// -------------------------------
const PORT = 5000;


// -------------------------------
// Zerbitzaria martxan jarri
// -------------------------------
async function zerbitzariaHasi() {
    try {

        // MongoDB-rekin konektatu
        const db = await konektatuDB();

        console.log("MongoDB konektatuta");

        // Bezeroen eta langileen rutak erregistratu
        app.use(bezeroRoutes(db));
        app.use(langileRoutes(db));
        app.use(crudOperazioak(db));

        // Zerbitzaria martxan jarri
        app.listen(PORT, () => {
            console.log(`Server-a ${PORT}-ean martxan`);
        });

    } catch (err) {
        console.error("Errorea zerbitzaria abiaraztean:", err);
    }
}

zerbitzariaHasi();
