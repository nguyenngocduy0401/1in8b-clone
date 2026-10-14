import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));
const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const decStart = js.indexOf('const DEC = {');
const decEnd = js.indexOf('function openDecision', decStart);
const decBlock = js.slice(decStart, decEnd);

// Let's inspect some decision keys and their text
const decMatches = [...decBlock.matchAll(/(?:^|\n)\s*([a-zA-Z0-9_]+):\s*\{/g)].map(m => m[1]);
console.log('Total decisions:', decMatches.length);

for (let i = 0; i < Math.min(8, decMatches.length); i++) {
  const dId = decMatches[i];
  const idx = decBlock.indexOf(`${dId}: {`);
  const chunk = decBlock.slice(idx, idx + 800);
  const titles = [...chunk.matchAll(/title:\s*L`([^`]+)`/g)].map(m => m[1]);
  const facts = [...chunk.matchAll(/fact:\s*L`([^`]+)`/g)].map(m => m[1]);
  const choices = [...chunk.matchAll(/label:\s*(?:[a-zA-Z0-9_?:]+\s*)?L`([^`]+)`/g)].map(m => m[1]);
  console.log(`Decision [${dId}]:`);
  if (titles[0]) console.log(`  Title KO: ${titles[0]} -> EN: ${i18n[titles[0]] || '?'}`);
  if (facts[0]) console.log(`  Fact KO: ${facts[0]?.slice(0, 50)}... -> EN: ${i18n[facts[0]]?.slice(0, 50) || '?'}`);
  if (choices.length) console.log(`  Choices (${choices.length}):`, choices.map(c => i18n[c] || c));
  console.log('---');
}
