import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules, __dirname is not available directly. We need to derive it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This correctly gets the directory of the current module (setupDOM.js)

export function setupDOM(filePath = '../index.html') { // Default path relative to setupDOM.js
  try {
    // Construct the absolute path to index.html
    // __dirname is C:\Users\monic\OneDrive\Desktop\J\from_github_bioskills\Bioskills_battle\tests
    // filePath is ../index.html (relative to __dirname)
    // path.resolve combines them to C:\Users\monic\OneDrive\Desktop\J\from_github_bioskills\Bioskills_battle\index.html
    const absoluteIndexPath = path.resolve(__dirname, filePath);
    const html = fs.readFileSync(absoluteIndexPath, 'utf8');
    document.body.innerHTML = html;
  } catch (error) {
    console.error(`Error reading HTML file at ${path.resolve(__dirname, filePath)}:`, error);
    throw error; // Re-throw to fail the test
  }
}
