import fs from 'fs';

const js = fs.readFileSync('scripts/original_1in8b.js', 'utf8');

// Search for canvas, pixel, draw, render, ui, audio, etc.
const uiKeywords = ['function render', 'function draw', 'function initUI', 'function px', 'const PX', 'class Sound', 'class Audio', 'function playSound', 'function bgm'];

for (const kw of uiKeywords) {
  const r = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-zA-Z0-9_]*', 'g');
  const matches = [...new Set([...js.matchAll(r)].map(m => m[0]))];
  console.log(`Matches for ${kw}:`, matches.slice(0, 15));
}

// Find where PX constants are
const pxMatches = [...js.matchAll(/const\s+(PX_[A-Z0-9_]+)\s*=/g)].map(m => m[1]);
console.log('PX constants:', pxMatches);
