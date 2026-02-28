// tests/regressions.test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('CSS Regression Tests', () => {
    test('.hide class must have !important to ensure visibility control', () => {
        const cssPath = path.join(__dirname, '../style.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');

        // Match .hide { display: none !important; } with flexible whitespace
        const hideRegex = /\.hide\s*\{\s*display\s*:\s*none\s*!important\s*;\s*\}/;
        expect(cssContent).toMatch(hideRegex);
    });

    test('There should be no duplicate sds-page IDs in index.html', () => {
        const htmlPath = path.join(__dirname, '../index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Count how many times id="sds-page" appears
        const idMatches = htmlContent.match(/id="sds-page"/g) || [];
        expect(idMatches.length).toBe(1);
    });

    test('There should be no duplicate techniques-grid IDs in index.html', () => {
        const htmlPath = path.join(__dirname, '../index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Count how many times id="techniques-grid" appears
        const idMatches = htmlContent.match(/id="techniques-grid"/g) || [];
        expect(idMatches.length).toBe(1);
    });
});
