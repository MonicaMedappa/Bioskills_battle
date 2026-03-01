// tests/library_expansion.test.js
import { jest } from '@jest/globals';

// Polyfill for TextEncoder and TextDecoder to address JSDOM compatibility issues
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

let QuizUI;

describe('Library Expansion Tests', () => {
    beforeAll(async () => {
        await polyfillTextEncoder();
        const module = await import('../src/quizUI.js');
        QuizUI = module.QuizUI;
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="landing-page" class="hide"></div>
            <div id="battle-hub-modal" class="hide"></div>
            <div id="lab-bench-page" class="hide"></div>
            <div id="library-page">
                <div id="articles-grid"></div>
            </div>
            <div id="sds-page" class="hide"></div>
            <div id="article-sets-page" class="hide">
                <button id="back-to-library-btn" class="back-btn">← Back to Library</button>
                <h2 id="article-sets-title">Article Analysis</h2>
                <div id="article-sets-grid" class="set-tiles-grid"></div>
            </div>
            <div id="quiz-container" class="hide"></div>
        `;
    });

    test('renderArticlesGrid should display full article metadata', () => {
        const articles = [
            {
                id: 'trichinellosis',
                title: 'Trichinellosis: A zoonosis that still requires vigilance',
                author: 'Ivana Mitic, Sasa Vasilev, Alisa Gruden-Movsesijan',
                university: 'University of Belgrade',
                journal: 'Plos Neglected Tropical Diseases',
                year: 'Jan, 2026',
                comingSoon: false
            }
        ];

        QuizUI.renderArticlesGrid(articles, jest.fn());

        const articleCard = document.querySelector('.article-card');
        expect(articleCard).toBeTruthy();

        const metaContainer = articleCard.querySelector('.article-meta-expandable');
        expect(metaContainer).toBeTruthy();

        expect(metaContainer.textContent).toContain(articles[0].author);
        expect(metaContainer.textContent).toContain(articles[0].university);
        expect(metaContainer.textContent).toContain(articles[0].year);
    });

    test('showArticleSetsPage should display sets page and hide library', () => {
        QuizUI.showArticleSetsPage();

        const setsPage = document.getElementById('article-sets-page');
        const libraryPage = document.getElementById('library-page');

        expect(setsPage.classList.contains('hide')).toBe(false);
        expect(libraryPage.classList.contains('hide')).toBe(true);
    });

    test('renderArticleSetsGrid should render tiles for each set', () => {
        const sets = [
            { id: 'set-1', title: 'Set 1' },
            { id: 'set-2', title: 'Set 2' }
        ];
        const callback = jest.fn();

        QuizUI.renderArticleSetsGrid(sets, callback);

        const grid = document.getElementById('article-sets-grid');
        const tiles = grid.querySelectorAll('.set-tile');

        expect(tiles.length).toBe(2);
        expect(tiles[0].textContent).toBe('Set 1');

        tiles[0].click();
        expect(callback).toHaveBeenCalledWith('set-1');
    });

    test('clicking a set tile should call handleTileClick with correct path', async () => {
        const sets = [{ id: 'data/library/trichinellosis/Set-1.json', title: 'Set 1' }];
        const callback = jest.fn();

        QuizUI.renderArticleSetsGrid(sets, callback);
        const tile = document.querySelector('.set-tile');
        tile.click();

        expect(callback).toHaveBeenCalledWith('data/library/trichinellosis/Set-1.json');
    });

    test('showQuiz should hide article sets page (Fixing side-panel bug)', () => {
        // Setup: Show the sets page first
        QuizUI.showArticleSetsPage();
        const setsPage = document.getElementById('article-sets-page');
        expect(setsPage.classList.contains('hide')).toBe(false);

        // Action: Show the quiz
        QuizUI.showQuiz();

        // Verification
        const quizContainer = document.getElementById('quiz-container');
        expect(quizContainer.classList.contains('hide')).toBe(false);
        expect(setsPage.classList.contains('hide')).toBe(true); // This SHOULD fail now
    });
});
