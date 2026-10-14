import fs from 'fs';

const i18n = JSON.parse(fs.readFileSync('src/data/i18n_source.json', 'utf8'));

// Search keys containing \u0001
const keysWith1 = Object.keys(i18n).filter(k => k.includes('\u0001'));
console.log('Total keys with \\u0001:', keysWith1.length);
console.log('Sample key with \\u0001:');
console.log(JSON.stringify(keysWith1[0]), '->', JSON.stringify(i18n[keysWith1[0]]));
console.log(JSON.stringify(keysWith1[1]), '->', JSON.stringify(i18n[keysWith1[1]]));

// Search for kid_dream in keys
const dreamKey = keysWith1.find(k => k.includes('커서 뭐가 되고 싶냐'));
console.log('Dream key found:', dreamKey ? JSON.stringify(dreamKey) : 'NONE');
if (dreamKey) {
  console.log('Dream translation:', i18n[dreamKey]);
}
