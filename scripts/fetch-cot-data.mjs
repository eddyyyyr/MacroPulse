import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📅 1. Génère la date d’aujourd’hui (ex: 2025-10-24)
const today = new Date().toISOString().split("T")[0];
const savePath = path.join(__dirname, `../data/cot-summary/${today}.json`);

// 🛰️ 2. Récupère les données COT comme avant
const cotData = {
  // Tu mets ici ta logique habituelle pour parser les fichiers HTML CFTC
  // Exemple factice :
  report_date: today,
  data: [
    { symbol: "EURUSD", long: 35000, short: 29000 },
    { symbol: "XAUUSD", long: 42000, short: 17000 },
  ],
};

// 💾 3. Sauvegarde localement
fs.writeFileSync(savePath, JSON.stringify(cotData, null, 2));
console.log(`✅ Données COT sauvegardées dans ${savePath}`);

// 🔁 4. Envoie à Base44 (si clé dispo)
const webhookUrl = "https://your-app.base44.com/functions/parseCOT";
const webhookSecret = process.env.BASE44_SECRET;

if (!webhookSecret) {
  console.error("❌ Aucun secret fourni pour BASE44_SECRET !");
  process.exit(1);
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${webhookSecret}`,
  },
  body: JSON.stringify(cotData),
});

if (!response.ok) {
  console.error(`❌ Erreur webhook Base44 : ${response.status} - ${await response.text()}`);
  process.exit(1);
}

console.log("✅ Données envoyées à Base44 avec succès !");
