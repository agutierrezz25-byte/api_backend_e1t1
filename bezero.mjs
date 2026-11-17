
import express from "express";

// -------------------------------
// Bezeroen rutak sortu
// -------------------------------
export default function bezeroRoutes(db) {

    const router = express.Router();

    // =====================================================
    // GET: Ekitaldi hurbilak lortu
    // URL: /ekitaldiak/bezeroak/hurbilekoak
    // Adib: ?hasiera=2024-05-01&amaiera=2024-05-31
    // =====================================================

    async function lortuHurbilekoEkitaldiak(req, res) {

        try {

            const iragazkia = {
                eventTownName: {
                    $in: ["Arrigorriaga", "Basauri", "Etxebarri", "Galdakao", "Bilbao"]
                }
            };

            // Data-tartea aukerazkoa da
            if (req.query.hasiera || req.query.amaiera) {

                iragazkia.eventStartDate = {};

                if (req.query.hasiera) {
                    iragazkia.eventStartDate.$gte = new Date(req.query.hasiera);
                }

                if (req.query.amaiera) {
                    iragazkia.eventStartDate.$lte = new Date(req.query.amaiera);
                }
            }

            // Ekitaldiak bilatu
            const ekitaldiak = await db.collection("ekitaldiak").find(iragazkia, {

                projection: {
                    documentName: 1,
                    eventType: 1,
                    eventStartDate: 1,
                    eventTimeTable: 1,
                    eventTownName: 1,
                    eventWhere: 1,
                    eventPrice: 1,
                    _id: 0
                }

            }).sort({ eventStartDate: 1 }).limit(50).toArray();

            res.json(ekitaldiak);

        } catch (err) {

            res.status(500).json({ error: err.message });

        }
    }

    router.get("/ekitaldiak/bezeroak/hurbilekoak", lortuHurbilekoEkitaldiak);



  // =====================================================
    // GET: Bilatu zure ekitaldia
    // URL: /ekitaldiak/bezeroak/bilatuZureEkitaldia
    // =====================================================
    async function bezeroEkitaldiakBilatu(req, res) {
        try {
            console.log("PARAMETROAK:", req.query);

            const ekitaldiak = await db.collection("ekitaldiak").find({
                eventType: req.query.eventType,
                eventTownName: req.query.eventTownName
            }).project({
                _id: 0,
                eventType: 1,
                eventWhere: 1,
                eventPrice: 1
            }).toArray();

            res.status(200).json(ekitaldiak);

        } catch (err) {
            console.error("ERROREA:", err);
            res.status(500).json({ error: err.message });
        }
    }

    router.get("/ekitaldiak/bezeroak/bilatuZureEkitaldia", bezeroEkitaldiakBilatu);

    return router;

}

   