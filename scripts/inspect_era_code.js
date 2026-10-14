import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const eraPos = js.indexOf('function initEraSel');
if (eraPos !== -1) {
  console.log('--- initEraSel snippet ---');
  console.log(js.slice(eraPos, eraPos + 1800));
}

// Check how era is used in country stats
const eraAfmPos = js.indexOf('function eraAfm');
if (eraAfmPos !== -1) {
  console.log('--- eraAfm snippet ---');
  console.log(js.slice(eraAfmPos, eraAfmPos + 1000));
}
