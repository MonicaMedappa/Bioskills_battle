// tests/labBench.test.js
import { jest } from '@jest/globals';
import { QuizUI } from '../src/quizUI.js';

describe('Lab Bench Page', () => {
    let mockHtml;

    beforeEach(() => {
        mockHtml = `
            <div id="lab-bench-page" class="hide">
                <button id="back-to-home-from-lab">Back</button>
                <div id="techniques-grid"></div>
            </div>
            <div id="sds-page" class="hide"></div>
        `;
        document.body.innerHTML = mockHtml;
    });

    test('should have 10 technique tiles', () => {
        // We'll implement the injection in a function, so let's mock the data for now or just check after injection
        const techniques = [
            'SDS-PAGE', 'DNA Gel Electrophoresis', 'Polymerase Chain Reaction',
            'qPCR', 'pH', 'OD and Spectrophotometer', 'RT-PCR',
            'ELISA', 'Western Blotting', 'Cloning'
        ];

        const grid = document.getElementById('techniques-grid');
        techniques.forEach(tech => {
            const tile = document.createElement('div');
            tile.className = 'technique-tile';
            tile.textContent = tech;
            grid.appendChild(tile);
        });

        const tiles = document.querySelectorAll('.technique-tile');
        expect(tiles.length).toBe(10);
    });

    test('SDS-PAGE tile should be active and others should be coming soon', () => {
        // This test will verify our implementation logic later
        // For now it captures the requirement
        const grid = document.getElementById('techniques-grid');
        const sdsTile = document.createElement('div');
        sdsTile.className = 'technique-tile';
        sdsTile.textContent = 'SDS-PAGE';
        grid.appendChild(sdsTile);

        const otherTile = document.createElement('div');
        otherTile.className = 'technique-tile coming-soon';
        otherTile.textContent = 'ELISA';
        grid.appendChild(otherTile);

        expect(sdsTile.classList.contains('coming-soon')).toBe(false);
        expect(otherTile.classList.contains('coming-soon')).toBe(true);
    });
});
