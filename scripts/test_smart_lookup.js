import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));
const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const evStart = js.indexOf('const EVENTS = [');
const evEnd = js.indexOf('const EVMAP =', evStart);
const eventsCode = js.slice(evStart, evEnd);

function matchTranslation(str) {
  if (!str) return '';
  if (i18n[str]) return i18n[str];

  // Convert ${...} to \u0001
  const keyWith1 = str.replace(/\$\{[^}]+\}/g, '\u0001');
  if (i18n[keyWith1]) return i18n[keyWith1];

  // Try trimming whitespace
  const trimmed = keyWith1.trim();
  if (i18n[trimmed]) return i18n[trimmed];

  return '';
}

const idMatches = [...eventsCode.matchAll(/(?:^|\n)\s*\{\s*id:\s*['"]([a-zA-Z0-9_]+)['"]/g)];

let matchedCount = 0;
for (let i = 0; i < idMatches.length; i++) {
  const m = idMatches[i];
  const nextIdx = i + 1 < idMatches.length ? idMatches[i + 1].index : eventsCode.length;
  const chunk = eventsCode.slice(m.index, nextIdx);
  const id = m[1];

  const rawTemplates = [...chunk.matchAll(/L`([\s\S]*?)`/g)].map(t => t[1]);
  const mainTemplate = rawTemplates[0] || '';
  const en = matchTranslation(mainTemplate);

  if (en) matchedCount++;
}

console.log(`Events with translation match: ${matchedCount} / ${idMatches.length} (${(matchedCount / idMatches.length * 100).toFixed(1)}%)`);
