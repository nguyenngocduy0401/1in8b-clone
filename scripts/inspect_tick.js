import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const tickPos = js.indexOf('function tick(');
console.log('--- tick and surroundings ---');
console.log(js.slice(tickPos, tickPos + 2500));

const firePos = js.indexOf('function fire(');
console.log('--- fire and surroundings ---');
console.log(js.slice(firePos, firePos + 2500));
