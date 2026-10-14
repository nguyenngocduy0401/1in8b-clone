import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const decPos = js.indexOf('const DEC = {');
console.log('const DEC = { pos:', decPos);
if (decPos !== -1) {
  console.log(js.slice(decPos, decPos + 1200));
}

// How long is EVENTS?
const evPos = js.indexOf('const EVENTS = [');
const evEnd = js.indexOf('];', evPos);
console.log('EVENTS start:', evPos, 'end:', evEnd, 'len:', evEnd - evPos);

// Count event IDs in EVENTS
const evMatches = [...js.slice(evPos, evEnd).matchAll(/id:\s*['"]([a-zA-Z0-9_]+)['"]/g)].map(m => m[1]);
console.log(`Total events in EVENTS: ${evMatches.length}`);
console.log('Sample event IDs:', evMatches.slice(0, 25));

// Find DEC keys
const decEnd = js.indexOf('function openDecision', decPos);
const decChunk = js.slice(decPos, decEnd);
const decMatches = [...decChunk.matchAll(/(?:^|\n)\s*([a-zA-Z0-9_]+):\s*\{/g)].map(m => m[1]);
console.log(`Total decisions in DEC: ${decMatches.length}`);
console.log('Decision IDs:', decMatches);
