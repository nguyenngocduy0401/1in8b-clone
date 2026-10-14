import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const i18nPos = js.indexOf('const I18N_T = {');
console.log('I18N_T pos:', i18nPos);

// Find end of I18N_T
const nextConst = js.indexOf('const COUNTRY_T =', i18nPos);
console.log('nextConst pos:', nextConst, 'size of I18N_T:', nextConst - i18nPos);

// Check sample keys in I18N_T
const sample = js.slice(i18nPos, i18nPos + 1500);
console.log('Sample I18N_T:');
console.log(sample);
