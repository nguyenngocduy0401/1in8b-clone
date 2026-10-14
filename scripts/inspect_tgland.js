import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

const tgPos = js.indexOf('function tgLand(');
if (tgPos !== -1) {
  console.log('--- tgLand snippet ---');
  console.log(js.slice(tgPos, tgPos + 1000));
} else {
  const p = js.indexOf('tgLand');
  console.log('tgLand index:', p);
  console.log(js.slice(p - 100, p + 400));
}
