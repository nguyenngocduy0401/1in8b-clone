import fs from 'fs';
import vm from 'vm';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// Find EVENTS block
const evStart = js.indexOf('const EVENTS = [');
const evEnd = js.indexOf('const EVMAP =', evStart);

const eventsCode = js.slice(evStart, evEnd);
console.log('Events code length:', eventsCode.length);

// Let's inspect the first 5 events to see their structure
const sandbox = {
  L: (strs, ...vals) => strs.reduce((acc, str, i) => acc + str + (vals[i] !== undefined ? vals[i] : ''), ''),
  console,
  Math,
  Set,
  Array,
  Object
};

// We can extract event metadata: id, a (age range), w (weight), and text templates!
// Let's write a parser that extracts each event definition
const evItems = [];
const idMatches = [...eventsCode.matchAll(/\{\s*id:\s*['"]([a-zA-Z0-9_]+)['"]/g)];
console.log('Total id matches:', idMatches.length);

// Let's inspect some event texts and facts
for (let i = 0; i < Math.min(10, idMatches.length); i++) {
  const m = idMatches[i];
  const nextIdx = i + 1 < idMatches.length ? idMatches[i + 1].index : m.index + 500;
  const chunk = eventsCode.slice(m.index, nextIdx);
  const id = m[1];
  const ageMatch = chunk.match(/a:\s*\[(\d+),\s*(\d+)\]/);
  const weightMatch = chunk.match(/w:\s*([0-9.]+)/);
  const textMatches = [...chunk.matchAll(/L`([^`]+)`/g)].map(tm => tm[1]);
  console.log(`Event [${id}]: age=[${ageMatch ? ageMatch[1] + '-' + ageMatch[2] : '?'}] weight=${weightMatch ? weightMatch[1] : 1} texts=${textMatches.length}`);
  if (textMatches.length) {
    console.log(`   Sample text: ${textMatches[0]}`);
  }
}
