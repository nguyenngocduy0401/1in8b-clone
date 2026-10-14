import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// Find where yearRoll is defined
const idx = js.indexOf('function yearRoll(');
if (idx !== -1) {
  console.log('--- yearRoll snippet ---');
  console.log(js.slice(idx, idx + 1500));
}

// Find what calls yearRoll
const yearRollCalls = [...js.matchAll(/[a-zA-Z0-9_.]+\s*yearRoll\(/g)].map(m => m[0]);
console.log('Calls to yearRoll:', yearRollCalls);

// Find the main step or tick loop:
const searchWords = ['function onYear', 'function year(', 'function step(', 'function nextYear', 'function tick'];
for (const word of searchWords) {
  const p = js.indexOf(word);
  if (p !== -1) {
    console.log(`Found ${word} at ${p}:`);
    console.log(js.slice(p, p + 400));
  }
}
