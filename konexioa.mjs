
 // -------------------------------
 // MongoDB driver-a inportatu
 // -------------------------------
import { MongoClient } from "mongodb";


// -------------------------------
// Konfigurazioa
// -------------------------------
const MONGO_URI = "mongodb://127.0.0.1:27017";

const DB_NAME = "dbE1T1";


// -------------------------------
// MongoClient sortu
// -------------------------------
const client = new MongoClient(MONGO_URI);


// -------------------------------
// Datubasearekin konektatzeko funtzioa
// -------------------------------
export async function konektatuDB() {

    try {

        // MongoDB-rekin konektatu
        await client.connect();

        console.log("MongoDB konektatuta");

        // Aukeratutako datubasea itzuli
        const db = client.db(DB_NAME);

        return db;

    } catch (err) {

        console.error("Errorea MongoDB-rekin konektatzean:", err);

        throw err;
    }
}
