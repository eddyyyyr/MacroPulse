import fs from "fs";
import path from "path";
import pkg from "./parseCot.js"; // <-- FIX ICI
const { parseCot } = pkg;

const output = parseCot();

const filePath = path.join("data", "cot", `${new Date().toISOString().slice(0, 10)}.json`);
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

console.log("✅ Fichier COT généré :", filePath);
