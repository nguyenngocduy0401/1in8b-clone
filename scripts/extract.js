import fs from 'fs';
import path from 'path';
import vm from 'vm';

const mdPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\a456d222-211c-47bc-a623-1348ba3b5a29\\.system_generated\\steps\\8\\content.md';
console.log('Reading content.md...');
const text = fs.readFileSync(mdPath, 'utf8');

const dataDir = path.resolve('src/data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const sandbox = {
  L: (strs, ...vals) => strs.reduce((acc, str, i) => acc + str + (vals[i] !== undefined ? vals[i] : ''), ''),
  console
};
const context = vm.createContext(sandbox);

// Extract COUNTRIES (already saved, but let's confirm)
if (!fs.existsSync(path.join(dataDir, 'countries.json'))) {
  const cMatch = text.match(/const COUNTRIES = (\[[\s\S]*?\]);/);
  if (cMatch) {
    const countries = JSON.parse(cMatch[1]);
    fs.writeFileSync(path.join(dataDir, 'countries.json'), JSON.stringify(countries, null, 2), 'utf8');
    console.log(`Saved ${countries.length} countries to countries.json`);
  }
} else {
  console.log('countries.json already exists');
}

// Extract NAMES
const nMatch = text.match(/const NAMES = (\{[\s\S]*?\n\});/);
if (nMatch) {
  try {
    const names = vm.runInContext('(' + nMatch[1] + ')', context);
    fs.writeFileSync(path.join(dataDir, 'names.json'), JSON.stringify(names, null, 2), 'utf8');
    console.log(`Saved NAMES to names.json, keys: ${Object.keys(names).length}`);
  } catch (err) {
    console.error('Failed parsing names with VM:', err.message);
  }
}

// Extract NAMES_T
const ntMatch = text.match(/const NAMES_T = (\{[\s\S]*?\});/);
if (ntMatch) {
  try {
    const namesT = vm.runInContext('(' + ntMatch[1] + ')', context);
    fs.writeFileSync(path.join(dataDir, 'names_t.json'), JSON.stringify(namesT, null, 2), 'utf8');
    console.log(`Saved NAMES_T to names_t.json, keys: ${Object.keys(namesT).length}`);
  } catch (err) {
    console.error('Failed parsing names_t with VM:', err.message);
  }
}

// Extract CITIES
const cityMatch = text.match(/const CITIES = (\{[\s\S]*?\});/);
if (cityMatch) {
  try {
    const cities = vm.runInContext('(' + cityMatch[1] + ')', context);
    fs.writeFileSync(path.join(dataDir, 'cities.json'), JSON.stringify(cities, null, 2), 'utf8');
    console.log(`Saved CITIES to cities.json, keys: ${Object.keys(cities).length}`);
  } catch (err) {
    console.error('Failed parsing cities with VM:', err.message);
  }
}

// Extract REL, SPORTS, HOBBIES, SCREEN, FEST
const relMatch = text.match(/const REL = (\{[\s\S]*?\});/);
const spMatch = text.match(/const SPORTS = (\{[\s\S]*?\});/);
const hbMatch = text.match(/const HOBBIES = (\{[\s\S]*?\});/);
const scrMatch = text.match(/const SCREEN = (\{[\s\S]*?\});/);
const festMatch = text.match(/const FEST = (\{[\s\S]*?\});/);

const meta = {};
if (relMatch) meta.REL = vm.runInContext('(' + relMatch[1] + ')', context);
if (spMatch) meta.SPORTS = vm.runInContext('(' + spMatch[1] + ')', context);
if (hbMatch) meta.HOBBIES = vm.runInContext('(' + hbMatch[1] + ')', context);
if (scrMatch) meta.SCREEN = vm.runInContext('(' + scrMatch[1] + ')', context);
if (festMatch) meta.FEST = vm.runInContext('(' + festMatch[1] + ')', context);

fs.writeFileSync(path.join(dataDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log('Saved meta.json with REL, SPORTS, HOBBIES, SCREEN, FEST');

// Extract I18N_T
const i18nMatch = text.match(/const I18N_T = (\{[\s\S]*?\n\});/);
if (i18nMatch) {
  try {
    const i18n = vm.runInContext('(' + i18nMatch[1] + ')', context);
    fs.writeFileSync(path.join(dataDir, 'i18n_source.json'), JSON.stringify(i18n, null, 2), 'utf8');
    console.log(`Saved I18N_T to i18n_source.json, total translation keys: ${Object.keys(i18n).length}`);
  } catch (err) {
    console.error('Failed parsing I18N_T with VM:', err.message);
  }
}
