import fs from "fs";
import path from "path";
import { parseCot } from "./parseCot.js";

const output = parseCot(); // tu peux adapter si tu veux des params

const filePath = path.join("data", "cot", `${new Date().toISOString().slice(0, 10)}.json`);
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

console.log("✅ Fichier COT généré :", filePath);
