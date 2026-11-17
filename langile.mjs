// ==============================================================================
// GET /ekitaldiak/langileak/osatugabeak
// Ordua edo prezioa falta duten ekitaldiak (langileek PATCH bidez osatzeko)
// Adib: /ekitaldiak/langileak/osatugabeak?herria=Arrigorriaga
// ==============================================================================

import express from "express";

export default function langileRoutes(db){

    const router = express.Router();

    async function lortuOsatugabeak(req, res) {
  try {
    const iragazkia = {
      $or: [
        { eventTimeTable: { $in: ["", null] } },
        { eventPrice: { $in: ["", null] } }
      ]
    };

    // Herria aukerazkoa da; ez bada jartzen, Arrigorriaga hartzen da
    iragazkia.eventTownName = req.query.herria || "Arrigorriaga";

    const ekitaldiak = await db.collection("ekitaldiak").find(iragazkia, {
      projection: {
        documentName: 1, eventType: 1, eventStartDate: 1,
        eventTimeTable: 1, eventPrice: 1, eventWhere: 1
      }
    }).sort({ eventStartDate: 1 }).limit(100).toArray();

    res.json({ guztira: ekitaldiak.length, ekitaldiak: ekitaldiak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
router.get("/ekitaldiak/langileak/osatugabeak", lortuOsatugabeak);

// =====================================================
    // GET: Ekitaldiak data-tarte pertsonalizatu bidez lortu
    // URL: /ekitaldiak/bezeroak/dataTartea
    // Adibidea Postman-en: ?hasiera=2024-01-01&amaiera=2024-06-01
    // =====================================================
    async function lortuEkitaldiakDataTartea(req, res) {
        try {
            const iragazkia = {};

            // Data-tartea dinamikoa da (hasiera eta amaiera aukeratzen dituzu)
            if (req.query.hasiera || req.query.amaiera) {
                iragazkia.eventStartDate = {};

                if (req.query.hasiera) {
                    iragazkia.eventStartDate.$gt = new Date(req.query.hasiera);
                }

                if (req.query.amaiera) {
                    iragazkia.eventStartDate.$lt = new Date(req.query.amaiera);
                }
            }

            const ekitaldiak = await db.collection("ekitaldiak").find(iragazkia).project({
                documentName: 1,
                eventType: 1,
                eventTownName: 1,
                eventPrice: 1,
                _id: 0
            }).toArray();

            res.status(200).json(ekitaldiak);

        } catch (err) {
            console.error("ERROREA:", err);
            res.status(500).json({ error: err.message });
        }
    }

    router.get("/ekitaldiak/bezeroak/dataTartea", lortuEkitaldiakDataTartea);

return router;
}
