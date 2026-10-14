import fs from 'fs';
import vm from 'vm';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const sandbox = {
  L: (strs, ...vals) => strs.reduce((acc, str, i) => acc + str + (vals[i] !== undefined ? vals[i] : ''), ''),
  console
};
const ctx = vm.createContext(sandbox);

function extractByBoundaries(startStr, endStr) {
  const p = js.indexOf(startStr);
  if (p === -1) return null;
  const pEnd = js.indexOf(endStr, p);
  let code = js.slice(p + startStr.length, pEnd).trim();
  if (code.endsWith(';')) code = code.slice(0, -1).trim();
  try {
    return vm.runInContext('(' + code + ')', ctx);
  } catch (e) {
    console.error('Failed to eval:', e.message);
    return null;
  }
}

const ethG = extractByBoundaries('const ETH_G =', 'const ROMA_S =');
const ethC = extractByBoundaries('const ETH_C =', ';\nfor (const iso in ROMA_S)');
const ethT = extractByBoundaries('const ETH_T =', 'const MIX_T =');

console.log('ETH_G keys:', ethG ? Object.keys(ethG).length : 0);
console.log('ETH_C keys:', ethC ? Object.keys(ethC).length : 0);
console.log('ETH_T keys:', ethT ? Object.keys(ethT).length : 0);

fs.writeFileSync('src/data/ethnicities.json', JSON.stringify({ ETH_G: ethG || {}, ETH_C: ethC || {}, ETH_T: ethT || {} }, null, 2), 'utf8');
console.log('Saved ethnicities.json successfully!');
