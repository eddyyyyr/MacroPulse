// scripts/fetch-cot-data.mjs

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import pkg from './parseCot.js';

const { parseCot } = pkg;

// Exécute la fonction
const output = parseCot();

// Crée le dossier s'il n'existe pas
const dir = 'data/cot';
mkdirSync(dir, { recursive: true });

// Génère un nom de fichier avec la date du jour
const now = new Date();
const dateStr = now.toISOString().split('T')[0]; // yyyy-mm-dd
const filePath = join(dir, `${dateStr}.json`);

// Sauvegarde le résultat dans un fichier JSON
writeFileSync(filePath, JSON.stringify(output, null, 2));

console.log(`✅ Fichier généré : ${filePath}`);
