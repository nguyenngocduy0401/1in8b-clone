import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const regex = /(?:const|let|var)\s+([A-Z0-9_]{2,})\s*=/g;
let m;
const list = [];
while ((m = regex.exec(js)) !== null) {
  list.push({ name: m[1], pos: m.index });
}

console.log('Total declared uppercase constants/vars:', list.length);
for (let i = 0; i < Math.min(80, list.length); i++) {
  const item = list[i];
  const nextPos = i + 1 < list.length ? list[i + 1].pos : item.pos + 500;
  console.log(`${item.name}: pos=${item.pos}, size=${nextPos - item.pos}`);
}
