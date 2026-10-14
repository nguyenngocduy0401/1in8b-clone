import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// Find major section comments or key definitions
const lines = js.split('\n');
console.log('Total lines in original_1in8b.js:', lines.length);

// Let's find landmarks
const landmarks = [];
lines.forEach((line, i) => {
  if (line.match(/^(?:\/\*|function\s+[a-zA-Z0-9_]+|const\s+[A-Z0-9_]{3,}\s*=|let\s+[A-Z0-9_]{3,}\s*=|class\s+)/)) {
    landmarks.push({ line: i + 1, text: line.slice(0, 100) });
  }
});

console.log('Total major landmarks found:', landmarks.length);

// Print sample of landmarks across the file
console.log('\n--- LANDMARK SAMPLES ---');
for (let step = 0; step < landmarks.length; step += Math.max(1, Math.floor(landmarks.length / 40))) {
  console.log(`L${landmarks[step].line}: ${landmarks[step].text}`);
}
