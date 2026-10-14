import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));
const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const evStart = js.indexOf('const EVENTS = [');
const evEnd = js.indexOf('const EVMAP =', evStart);
const eventsCode = js.slice(evStart, evEnd);

// Find each { id: '...' ... }
const idMatches = [...eventsCode.matchAll(/(?:^|\n)\s*\{\s*id:\s*['"]([a-zA-Z0-9_]+)['"]/g)];
console.log('Total id matches in EVENTS:', idMatches.length);

const parsedEvents = [];

for (let i = 0; i < idMatches.length; i++) {
  const m = idMatches[i];
  const nextIdx = i + 1 < idMatches.length ? idMatches[i + 1].index : eventsCode.length;
  const chunk = eventsCode.slice(m.index, nextIdx);
  const id = m[1];

  const ageMatch = chunk.match(/a:\s*\[(\d+),\s*(\d+)\]/);
  const minAge = ageMatch ? parseInt(ageMatch[1], 10) : 0;
  const maxAge = ageMatch ? parseInt(ageMatch[2], 10) : 100;

  const wMatch = chunk.match(/w:\s*([0-9.]+)/);
  const weight = wMatch ? parseFloat(wMatch[1]) : 1;

  // Extract all L`...` templates
  const rawTemplates = [...chunk.matchAll(/L`([\s\S]*?)`/g)].map(t => t[1]);

  // Separate facts (usually contain numbers, statistics, source in parentheses like WHO, UNICEF, World Bank, etc.)
  const texts = [];
  const facts = [];

  for (const t of rawTemplates) {
    if (t.match(/(?:WHO|UNICEF|World Bank|ILO|UNESCO|OECD|Lancet|Gallup|Pew|통계청|연구|조사|20\d\d년|\d+%)/i) && t.length > 30) {
      facts.push(t);
    } else {
      texts.push(t);
    }
  }

  // Look up EN in i18n
  const mainKo = texts[0] || '';
  const mainEn = i18n[mainKo] || '';
  const factKo = facts[0] || '';
  const factEn = i18n[factKo] || '';

  parsedEvents.push({
    id,
    minAge,
    maxAge,
    weight,
    rawTextCount: rawTemplates.length,
    ko: mainKo,
    en: mainEn,
    factKo,
    factEn
  });
}

console.log('Parsed events count:', parsedEvents.length);
console.log('Sample parsed events:');
parsedEvents.slice(0, 15).forEach(e => {
  console.log(`[${e.id}] (${e.minAge}-${e.maxAge}) w=${e.weight}`);
  console.log(`   KO: ${e.ko.slice(0, 70)}...`);
  console.log(`   EN: ${e.en ? e.en.slice(0, 70) + '...' : '[NO EN]'}`);
  if (e.factKo) {
    console.log(`   FACT: ${e.factEn ? e.factEn.slice(0, 70) + '...' : e.factKo.slice(0, 70) + '...'}`);
  }
});

// Count how many have English translations
const withEn = parsedEvents.filter(e => e.en).length;
console.log(`Events with exact English match: ${withEn} / ${parsedEvents.length}`);
