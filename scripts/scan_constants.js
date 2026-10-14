import fs from 'fs';
import vm from 'vm';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// List of interesting constants
const targets = [
  'COUNTRIES', 'COUNTRY_T', 'CITIES_T', 'NAMES_T', 'NAMES', 'CITIES',
  'REL', 'FEST_RB', 'FEST', 'FEST_FAITH', 'FEST_C',
  'SPORTS', 'HOBBIES', 'SCREEN', 'BOARD', 'EDU', 'JOBS',
  'CAUSE', 'OINF', 'OCD_SUB', 'CT', 'REF', 'OD', 'SUIC',
  'WORLD', 'WORLD_C', 'LOST', 'HIT_R', 'HIT_C', 'CP_BAN', 'KID_HELP',
  'HIT_FACT', 'CBY', 'TAX_C', 'TAX_R', 'SAVE_K', 'AFM_M', 'AFM_D',
  'POLY', 'POLY_N', 'HOOK', 'AGE12', 'PRISON_RATE', 'CRIME_Q',
  'SENT', 'FINE_K', 'PRISON_Y', 'DIS_NM', 'DIS_NOJOB', 'CAL', 'PCAL'
];

console.log('--- Analyzing constants ---');
for (const target of targets) {
  // Regex to find start of constant
  const regex = new RegExp(`(?:const|let|var)\\s+${target}\\s*=`, 'g');
  const match = regex.exec(js);
  if (match) {
    const startIdx = match.index;
    // Look at first 200 chars
    const snippet = js.slice(startIdx, startIdx + 200).replace(/\r?\n/g, ' ');
    console.log(`FOUND: ${target} at offset ${startIdx}: ${snippet}`);
  } else {
    console.log(`NOT FOUND: ${target}`);
  }
}
