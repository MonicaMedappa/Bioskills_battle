// tests/data.test.js
import { labTechniques, libraryArticles, articleSets } from '../src/data.js';

describe('Game Data Module', () => {
    test('labTechniques should contain SDS-PAGE', () => {
        const sdsPage = labTechniques.find(tech => tech.id === 'sds-page');
        expect(sdsPage).toBeDefined();
        expect(sdsPage.title).toBe('SDS-PAGE');
    });

    test('libraryArticles should contain Trichinellosis', () => {
        const trich = libraryArticles.find(art => art.id === 'trichinellosis');
        expect(trich).toBeDefined();
        expect(trich.title).toContain('Trichinellosis');
    });

    test('articleSets should contain mappings for trichinellosis', () => {
        expect(articleSets['trichinellosis']).toBeDefined();
        expect(articleSets['trichinellosis'].length).toBe(6);
    });
});
