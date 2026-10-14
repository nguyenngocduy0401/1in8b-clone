import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const evPos = js.indexOf('const EVENTS =');
console.log('EVENTS pos:', evPos);
if (evPos !== -1) {
  console.log(js.slice(evPos, evPos + 1000));
}

// Let's also check decisions: DECISIONS or DECISION or DEC
const decPos = js.indexOf('const DECISIONS =');
console.log('DECISIONS pos:', decPos);
if (decPos !== -1) {
  console.log(js.slice(decPos, decPos + 1000));
} else {
  // Let's find openDecision
  const odPos = js.indexOf('function openDecision(');
  console.log('openDecision pos:', odPos);
  if (odPos !== -1) {
    console.log(js.slice(odPos, odPos + 800));
  }
}
