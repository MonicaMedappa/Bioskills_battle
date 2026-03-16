import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.join(__dirname, '../style.css');

describe('UI Refinement Standards (Blinking & Hover)', () => {
    let cssContent;

    beforeAll(() => {
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    test('.set-tile should be fully opaque (alpha=1) to prevent background grid interaction', () => {
        // Find .set-tile { ... background: X ... }
        // We want to ensure it's not semi-transparent
        const setTileRegex = /\.set-tile\s*\{([^}]*)\}/g;
        const match = setTileRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        // Check if background uses rgba with alpha < 1
        const rgbaMatch = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/.exec(properties);
        if (rgbaMatch) {
            const alpha = parseFloat(rgbaMatch[1]);
            expect(alpha).toBe(1);
        }
    });

    test('.set-tile:hover should have a light neon purple border (#bf40ff)', () => {
        const hoverRegex = /\.set-tile:hover\s*\{([^}]*)\}/g;
        const match = hoverRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        expect(properties).toMatch(/border-color:\s*#bf40ff/);
    });

    test('.set-tile:hover should have a soft purple glow (box-shadow)', () => {
        const hoverRegex = /\.set-tile:hover\s*\{([^}]*)\}/g;
        const match = hoverRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        expect(properties).toMatch(/box-shadow:[^;]*rgba\(\s*191\s*,\s*64\s*,\s*255/);
    });

    test('.technique-tile:hover should have the same neon purple border and glow', () => {
        const hoverRegex = /\.technique-tile:hover:not\(\.coming-soon\)\s*\{([^}]*)\}/g;
        const match = hoverRegex.exec(cssContent);
        expect(match).not.toBeNull();

        const properties = match[1];
        expect(properties).toMatch(/border-color:\s*#bf40ff/);
        // Red test: change expected to #bf40ff after first fail
    });
});
