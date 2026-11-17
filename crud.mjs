
        
import express from "express";

export default function crudOperazioak(db){

    const router = express.Router();
    // Get motatako operazioa
    async function oinarrizkoInformazioa(req, res) {
    try {
        const ekitaldiak = await db.collection("ekitaldiak").aggregate([
            {
                $project: {
                    _id: 0,
                    documentName: 1,
                    eventType: 1,
                    eventStartDate: {
                        $dateToString: {
                            format: "%Y/%m/%d",
                            date: "$eventStartDate"
                        }
                    },
                    eventWhere: 1,
                    eventPrice: 1
                }
            }
        ]).toArray();

        res.json(ekitaldiak);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

   
}
 router.get("/ekitaldiak/info/oinarrizko", oinarrizkoInformazioa)

    //Post motatako operazioa
   async function ekitaldiaGehitu(req, res) {
        try {
            const emaitza = await db.collection("ekitaldiak").insertOne({
              documentName: "Euskadiko Orkesta: \"Sinfonia Batzuk\"",
                documentDescription: "Euskadiko Orkestraren kontzertu berezia Bizkaian.",
                eventType: "Musika",
                eventStartDate: new Date("2025-11-10T00:00:00.000Z"),
                eventEndDate: new Date("2025-11-10T00:00:00.000Z"),
                eventCountryName: "Espainia",
                eventTerritoryName: "Bizkaia",
                eventTownName: "Santurtzi",
                eventLocation: "",
                eventLocationName: "",
                eventWhere: "Serantes Kultur Aretoa",
                eventSponsor: "",
                eventRegistrationStartDate: new Date("2025-10-01T00:00:00.000Z"),
                eventRegistrationEndDate: new Date("2025-11-09T00:00:00.000Z"),
                eventOnLine: "Ez",
                eventTimeTable: "19:30",
                eventPrice: "15 €",
                eventDuration: "90 min",
                eventLanguages: "Euskara",
                eventImageUrl: "/contenidos/evento/202511100001/eu_def/images/kontzertua.jpg",
                eventSourceUrl: "https://www.euskadikoorkestra.eus",
                latitudelongitude: "43.328900,-3.031500",
                latwgs84: "43.328900",
                lonwgs84: "-3.031500",
                placename: "Serantes Kultur Aretoa",
                address: "Cristóbal de Murrieta Etorbidea, 1",
                municipality: "Santurtzi",
                postalcode: "48980",
                territory: "Bizkaia",
                country: "España",
                phone: "944839244",
                email: "info@serantes.com",
                webpage: "https://www.serantes.com"
            });

            res.status(201).json({
                mezua: "Ekitaldia behar bezala gehitu da",
                insertedId: emaitza.insertedId
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    router.post("/ekitaldiak/txertatuBat", ekitaldiaGehitu);

    async function prezioaEguneratu(req, res) {
    try {
        const emaitza = await db.collection("ekitaldiak").updateOne(
            {
                documentName: 'Euskadiko Orkesta: "Sinfonia Batzuk"'
            },
            {
                $set: {
                    eventPrice: "20 €"
                }
            }
        );

        res.json({
            mezua: "Ekitaldiaren prezioa eguneratu da",
            modifiedCount: emaitza.modifiedCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

router.patch("/ekitaldiak/prezioaEguneratu", prezioaEguneratu);

// ==========================================
// DELETE: Ekitaldia ezabatu
// ==========================================

async function ekitaldiaEzabatu(req, res) {
    try {
        const emaitza = await db.collection("ekitaldiak").deleteOne({
            documentName: 'Euskadiko Orkesta: "Sinfonia Batzuk"'
        });

        res.json({
            mezua: "Ekitaldia ezabatzeko eskaera egin da",
            deletedCount: emaitza.deletedCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

router.delete("/ekitaldiak/ezabatuBat", ekitaldiaEzabatu);

    return router;
}