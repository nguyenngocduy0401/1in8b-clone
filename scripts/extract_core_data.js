import fs from 'fs';
import vm from 'vm';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const sandbox = {
  L: (strs, ...vals) => strs.reduce((acc, str, i) => acc + str + (vals[i] !== undefined ? vals[i] : ''), ''),
  console
};
const ctx = vm.createContext(sandbox);

function extractConst(name) {
  const r = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*([\\s\\S]*?);\\s*(?:const|let|var|function|if|\\n\\n)`);
  const m = r.exec(js);
  if (!m) {
    console.warn(`Could not find ${name}`);
    return null;
  }
  try {
    return vm.runInContext('(' + m[1] + ')', ctx);
  } catch (e) {
    console.error(`Error evaluating ${name}:`, e.message);
    return null;
  }
}

// 1. Eras & Historical Calibration
const cal = extractConst('CAL');
const pcal = extractConst('PCAL');
if (cal && pcal) {
  const erasData = {
    CAL: cal,
    PCAL: pcal,
    eras: [
      { id: 'now', name: { vi: 'Thời đại ngày nay (2024)', en: 'Modern Day (2024)', ko: '현재 (2024)' }, year: 2024 },
      { id: '2010', name: { vi: 'Thế hệ 2010 (Kỷ nguyên Internet)', en: 'Era 2010 (Mobile & Internet)', ko: '2010년대' }, year: 2010 },
      { id: '1990', name: { vi: 'Thế hệ 1990 (Hậu Chiến tranh Lạnh)', en: 'Era 1990 (Post-Cold War)', ko: '1990년대' }, year: 1990 },
      { id: '1970', name: { vi: 'Thế hệ 1970 (Kỷ nguyên công nghiệp)', en: 'Era 1970 (Industrial Expansion)', ko: '1970년대' }, year: 1970 },
      { id: '1950', name: { vi: 'Thế hệ 1950 (Thời hậu chiến)', en: 'Era 1950 (Post-WWII)', ko: '1950년대' }, year: 1950 }
    ]
  };
  fs.writeFileSync('src/data/eras.json', JSON.stringify(erasData, null, 2), 'utf8');
  console.log('Saved eras.json');
}

// 2. Society: Tax, Marriage, Polygamy
const taxC = extractConst('TAX_C');
const taxR = extractConst('TAX_R');
const afmM = extractConst('AFM_M');
const poly = extractConst('POLY');
const cpBan = extractConst('CP_BAN');
const hitR = extractConst('HIT_R');
const hitC = extractConst('HIT_C');

const societyData = {
  TAX_C: taxC || {},
  TAX_R: taxR || {},
  AFM_M: afmM || {},
  POLY: poly || {},
  CP_BAN: cpBan || {},
  HIT_R: hitR || {},
  HIT_C: hitC || {}
};
fs.writeFileSync('src/data/society.json', JSON.stringify(societyData, null, 2), 'utf8');
console.log('Saved society.json');

// 3. Legal & Crime
const prisonRate = extractConst('PRISON_RATE');
const crimeQ = extractConst('CRIME_Q');
const sent = extractConst('SENT');
const fineK = extractConst('FINE_K');
const prisonY = extractConst('PRISON_Y');

const legalData = {
  PRISON_RATE: prisonRate || {},
  CRIME_Q: crimeQ || [],
  SENT: sent || {},
  FINE_K: fineK || {},
  PRISON_Y: prisonY || {}
};
fs.writeFileSync('src/data/legal.json', JSON.stringify(legalData, null, 2), 'utf8');
console.log('Saved legal.json');

// 4. World Map Land Data
const world = extractConst('WORLD');
if (world) {
  fs.writeFileSync('src/data/world.json', JSON.stringify(world, null, 2), 'utf8');
  console.log('Saved world.json (width:', world.w, 'height:', world.h, ')');
}
