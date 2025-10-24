import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

// Déduire __dirname (car on est en module ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📥 Lire le fichier JSON brut généré manuellement chaque vendredi soir
const today = new Date().toISOString().slice(0, 10); // ex: "2025-10-24"
const rawPath = path.join(__dirname, `../data/cot/${today}.json`);
let rawData = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

// ⚠️ Reformater l'objet en tableau si besoin
if (!Array.isArray(rawData)) {
  rawData = Object.entries(rawData).map(([pair, values]) => ({
    pair,
    ...values,
  }));
}

// 🔐 Clé secrète (depuis GitHub Secrets)
const BASE44_SECRET = process.env.BASE44_SECRET;
const BASE44_ENDPOINT = "https://macropulse.base44.app/functions/parseCOT";

// 📤 Envoi à Base44
const response = await fetch(BASE44_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${BASE44_SECRET}`,
  },
  body: JSON.stringify({
    report_date: today,
    data: rawData,
  }),
});

// 💾 Récupérer et sauvegarder le fichier d'analyse IA
const parsed = await response.json();
const outPath = path.join(__dirname, `../data/cot-summary/${today}.json`);
fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), "utf-8");

console.log(`✅ Analyse IA sauvegardée dans: ${outPath}`);
