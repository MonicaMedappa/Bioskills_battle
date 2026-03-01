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

describe('Library Expansion Stage 1: Article Grid Detail Display', () => {
    beforeAll(async () => {
        await polyfillTextEncoder();
        const module = await import('../src/quizUI.js');
        QuizUI = module.QuizUI;
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="library-page">
                <div id="articles-grid"></div>
            </div>
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
});
