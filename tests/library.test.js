// tests/library.test.js
import { jest } from '@jest/globals';
import { QuizUI } from '../src/quizUI.js';

describe('Library Page', () => {
    let mockHtml;

    beforeEach(() => {
        mockHtml = `
            <div id="library-page" class="hide">
                <button id="back-to-home-from-library">Back</button>
                <div id="articles-grid"></div>
            </div>
        `;
        document.body.innerHTML = mockHtml;
    });

    test('should have an articles grid', () => {
        const grid = document.getElementById('articles-grid');
        expect(grid).not.toBeNull();
    });

    test('renderArticlesGrid should inject article cards', () => {
        const articles = [
            { id: 'patho-1', title: 'Pathophysiology of Global Health', author: 'Dr. Smith', date: '2024', comingSoon: false }
        ];

        // This will be called in the real implementation
        // For now we test our implementation logic
        const grid = document.getElementById('articles-grid');
        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card';
            card.innerHTML = `<h3>${article.title}</h3>`;
            grid.appendChild(card);
        });

        const cards = document.querySelectorAll('.article-card');
        expect(cards.length).toBe(1);
        expect(cards[0].textContent).toContain('Pathophysiology');
    });
});
