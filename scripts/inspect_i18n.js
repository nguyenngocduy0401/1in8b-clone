import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

console.log('--- Start of original_1in8b.js ---');
console.log(js.slice(0, 3000));
