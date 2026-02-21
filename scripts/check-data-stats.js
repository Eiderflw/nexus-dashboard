const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'public', 'tiktok_full_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const creators = data.analysis.data.anchorAnalysisDataInfos;

const total = creators.length;
const totalDiamonds = creators.reduce((sum, c) => sum + (c.diamonds || 0), 0);
const inactive = creators.filter(c => c.validDays === 0).length;
const regular = creators.filter(c => c.validDays > 0 && c.validDays < 15).length;
const superWorkers = creators.filter(c => c.validDays >= 15).length;
const top3 = creators.sort((a, b) => b.diamonds - a.diamonds).slice(0, 3).map(c => `${c.username} (${c.diamonds})`);

console.log(`Buscando en: ${dataPath}`);
console.log(`--------------------------------`);
console.log(`Total Creadores: ${total}`);
console.log(`Total Diamantes: ${totalDiamonds.toLocaleString()}`);
console.log(`Inactivos (0 días): ${inactive}`);
console.log(`Regulares (1-14 días): ${regular}`);
console.log(`Super Trabajadores (15+ días): ${superWorkers}`);
console.log(`Top 3: ${top3.join(', ')}`);
console.log(`--------------------------------`);
console.log(`Campos extraídos (Ejemplo): ${Object.keys(creators[0]).join(', ')}`);
