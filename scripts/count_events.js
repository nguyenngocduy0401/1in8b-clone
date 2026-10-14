import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const evPos = js.indexOf('const EVENTS = [');
console.log('evPos:', evPos);

// Count how many `{ id: '` or `{ id: "` in EVENTS up to EVMAP or whatever follows
const evmapPos = js.indexOf('const EVMAP =', evPos);
console.log('evmapPos:', evmapPos, 'length between:', evmapPos - evPos);

const eventsBlock = js.slice(evPos, evmapPos);
const allEvIds = [...eventsBlock.matchAll(/id:\s*['"]([a-zA-Z0-9_]+)['"]/g)].map(m => m[1]);
console.log('Total events in EVENTS block:', allEvIds.length);
console.log('First 40 event IDs:', allEvIds.slice(0, 40));
console.log('Last 20 event IDs:', allEvIds.slice(-20));
