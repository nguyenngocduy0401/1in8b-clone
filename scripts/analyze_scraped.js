import fs from 'fs';

const contentPath = 'C:/Users/Duy/.gemini/antigravity/brain/e02c5d4c-b615-4bd8-a49b-68d8d4d690fc/.system_generated/steps/26/content.md';
const content = fs.readFileSync(contentPath, 'utf8');
console.log('Total length:', content.length);

const scriptMatches = content.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Script tags count:', scriptMatches.length);

scriptMatches.forEach((s, idx) => {
  const preview = s.slice(0, 150).replace(/\r?\n/g, ' ');
  console.log(`Script ${idx}: length=${s.length}, snippet=${preview}...`);
});
