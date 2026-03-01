import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.join(__dirname, '../style.css');

describe('CSS Clipping Prevention Standards', () => {
    let cssContent;

    beforeAll(() => {
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    test('.set-tile should have a line-height of at least 1.6 to prevent descender clipping', () => {
        // Look for .set-tile { ... line-height: X.X; ... }
        const setTileRegex = /\.set-tile\s*\{([^}]*)\}/g;
        const match = setTileRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        const lineHeightMatch = /line-height:\s*([\d.]+)/.exec(properties);
        expect(lineHeightMatch).not.toBeNull();

        const lineHeight = parseFloat(lineHeightMatch[1]);
        expect(lineHeight).toBeGreaterThanOrEqual(1.6);
    });

    test('.set-tiles-grid should have a minmax column width of at least 160px to prevent narrow wrapping', () => {
        const gridRegex = /\.set-tiles-grid\s*\{([^}]*)\}/g;
        const match = gridRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        const minmaxMatch = /grid-template-columns:[^;]*minmax\(\s*(\d+)px/.exec(properties);
        expect(minmaxMatch).not.toBeNull();

        const minWidth = parseInt(minmaxMatch[1], 10);
        expect(minWidth).toBeGreaterThanOrEqual(160);
    });
});
