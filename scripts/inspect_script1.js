import fs from 'fs';

const contentPath = 'C:/Users/Duy/.gemini/antigravity/brain/e02c5d4c-b615-4bd8-a49b-68d8d4d690fc/.system_generated/steps/26/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const script1Match = content.match(/<script>([\s\S]*?)<\/script>/i);
if (!script1Match) {
  console.log('Script 1 not found');
  process.exit(1);
}

const js = script1Match[1];
console.log('Script 1 JS length:', js.length);

// Save the full JS to a standalone file for deep inspection
fs.writeFileSync('scripts/original_1in8b.js', js, 'utf8');
console.log('Saved original_1in8b.js');

// Find all `const NAME =` or `let NAME =` or `function NAME(`
const constMatches = [...js.matchAll(/(?:const|let|var)\s+([A-Z0-9_]{2,})\s*=/g)].map(m => m[1]);
console.log('Unique capitalized CONSTANTS/VARS:', [...new Set(constMatches)]);

// Check for specific major structures
const functions = [...js.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
console.log('Total functions:', functions.length);
console.log('First 30 functions:', functions.slice(0, 30));
