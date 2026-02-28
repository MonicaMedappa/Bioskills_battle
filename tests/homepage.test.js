// tests/homepage.test.js
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for TextEncoder and TextDecoder
async function polyfillTextEncoder() {
    if (typeof TextEncoder === 'undefined') {
        const util = await import('util');
        global.TextEncoder = util.TextEncoder;
    }
    if (typeof TextDecoder === 'undefined') {
        const util = await import('util');
        global.TextDecoder = util.TextDecoder;
    }
}

describe('Homepage Restructure', () => {
    let mockHtml;

    beforeAll(async () => {
        await polyfillTextEncoder();
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const htmlFilePath = path.join(__dirname, '../index.html');
        mockHtml = fs.readFileSync(htmlFilePath, 'utf8');
    });

    beforeEach(() => {
        document.body.innerHTML = mockHtml;
    });

    test('should have a game title "Bioskills Battle"', () => {
        const title = document.getElementById('game-title');
        expect(title).not.toBeNull();
        expect(title.textContent).toBe('Bioskills Battle');
    });

    test('should have an introduction text', () => {
        const intro = document.getElementById('intro-section');
        expect(intro).not.toBeNull();
        expect(intro.textContent).toContain('Hey Skiller!');
    });

    test('should have a "Choose your Battle Hub" button', () => {
        const hubBtn = document.getElementById('choose-hub-btn');
        expect(hubBtn).not.toBeNull();
        expect(hubBtn.textContent).toBe('Choose your Battle Hub');
    });

    test('should NOT have the old "GOOD LUCK!" button', () => {
        const oldBtn = document.getElementById('start-btn');
        expect(oldBtn).toBeNull();
    });
});
