import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const worldPos = js.indexOf('const WORLD =');
console.log('--- WORLD snippet ---');
console.log(js.slice(worldPos, worldPos + 600));

// Search for drawLifeMap or renderMini or where WORLD is used
const worldUses = [...js.matchAll(/WORLD\.[a-zA-Z0-9_]+/g)].map(m => m[0]);
console.log('WORLD properties accessed:', [...new Set(worldUses)]);

// Find function drawLifeMap
const dlmPos = js.indexOf('function drawLifeMap');
if (dlmPos !== -1) {
  console.log('--- drawLifeMap snippet ---');
  console.log(js.slice(dlmPos, dlmPos + 1200));
}

// Find function renderMini
const rmPos = js.indexOf('function renderMini');
if (rmPos !== -1) {
  console.log('--- renderMini snippet ---');
  console.log(js.slice(rmPos, rmPos + 1200));
}
