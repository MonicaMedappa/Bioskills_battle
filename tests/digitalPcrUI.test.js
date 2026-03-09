// tests/digitalPcrUI.test.js
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QuizUI } from '../src/quizUI.js';

async function polyfillTextEncoder() {
    if (typeof TextEncoder === 'undefined') {
        const util = await import('util');
        global.TextEncoder = util.TextEncoder;
    }
}

describe('Digital PCR UI', () => {
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

    test('getDigitalPcrPage should return the correctly IDed element', () => {
        const page = QuizUI.getDigitalPcrPage();
        expect(page).not.toBeNull();
        expect(page.id).toBe('digital-pcr-page');
    });

    test('showDigitalPcrPage should hide others and show digital-pcr-page', () => {
        QuizUI.showDigitalPcrPage();
        expect(QuizUI.getDigitalPcrPage().classList.contains('hide')).toBe(false);
        expect(QuizUI.getLandingPage().classList.contains('hide')).toBe(true);
    });

    test('getBackToLabFromDigitalPcrButton should return the correct element', () => {
        const btn = QuizUI.getBackToLabFromDigitalPcrButton();
        expect(btn).not.toBeNull();
        expect(btn.id).toBe('back-to-lab-from-digital-pcr-btn');
    });

    test('getDigitalPcrSetsGrid should return the correct element', () => {
        const grid = QuizUI.getDigitalPcrSetsGrid();
        expect(grid).not.toBeNull();
        expect(grid.id).toBe('digital-pcr-sets-grid');
    });

    test('renderDigitalPcrSetsGrid should render the General Digital PCR (dPCR) Quiz card', () => {
        const mockSets = [{ id: 'data/digital-pcr/Digital PCR.json', title: 'General Digital PCR (dPCR) Quiz' }];
        const mockHandler = jest.fn();

        QuizUI.renderDigitalPcrSetsGrid(mockSets, mockHandler);

        const grid = QuizUI.getDigitalPcrSetsGrid();
        const tile = grid.querySelector('.set-tile');
        expect(tile).not.toBeNull();
        expect(tile.textContent).toBe('General Digital PCR (dPCR) Quiz');

        tile.click();
        expect(mockHandler).toHaveBeenCalledWith('data/digital-pcr/Digital PCR.json');
    });
});
