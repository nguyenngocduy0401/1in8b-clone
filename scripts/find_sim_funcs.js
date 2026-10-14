import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// Find function definitions related to life cycle
const funcNames = [
  'initLife', 'newLife', 'startLife', 'stepYear', 'advanceYear', 'year', 'onYear',
  'die', 'death', 'checkDeath', 'makeDecision', 'chooseDecision', 'triggerDecision',
  'initBirth', 'rollCountry', 'birthStory', 'retireAge', 'marry', 'haveKid', 'getSick'
];

for (const name of funcNames) {
  const r = new RegExp(`function\\s+${name}\\s*\\([^)]*\\)`, 'g');
  const m = r.exec(js);
  if (m) {
    console.log(`Found function: ${m[0]}`);
  }
}

// Let's search for how the simulation step is called:
const yearMatches = [...js.matchAll(/function\s+([a-zA-Z0-9_]*year[a-zA-Z0-9_]*)\s*\(/gi)].map(m => m[1]);
console.log('Functions with "year" in name:', yearMatches);

const stepMatches = [...js.matchAll(/function\s+([a-zA-Z0-9_]*step[a-zA-Z0-9_]*)\s*\(/gi)].map(m => m[1]);
console.log('Functions with "step" in name:', stepMatches);

const lifeMatches = [...js.matchAll(/function\s+([a-zA-Z0-9_]*life[a-zA-Z0-9_]*)\s*\(/gi)].map(m => m[1]);
console.log('Functions with "life" in name:', lifeMatches);
