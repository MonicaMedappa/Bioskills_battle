// tests/data.test.js
import { labTechniques, libraryArticles, articleSets, qpcrSets, digitalPcrSets } from '../src/data.js';

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

    describe('qpcrSets', () => {
        test('should export qpcrSets with 7 entries (General + 6 sections)', () => {
            expect(qpcrSets).toBeDefined();
            expect(qpcrSets).toHaveLength(7);
        });

        test('every entry should have an id and title', () => {
            qpcrSets.forEach(set => {
                expect(set).toHaveProperty('id');
                expect(set).toHaveProperty('title');
                expect(typeof set.id).toBe('string');
                expect(typeof set.title).toBe('string');
            });
        });

        test('should contain the General qPCR Quiz as first entry', () => {
            expect(qpcrSets[0].id).toBe('qPCR.json');
            expect(qpcrSets[0].title).toBe('General qPCR Quiz');
        });

        test('should contain all 6 new section titles', () => {
            const titles = qpcrSets.map(s => s.title);
            expect(titles).toContain('Real-Time PCR Fundamentals');
            expect(titles).toContain('The Chemistry of qPCR');
            expect(titles).toContain('Principles and Optimization');
            expect(titles).toContain('The qPCR Essentials Quiz');
            expect(titles).toContain('qPCR Data Analysis & Assay Validation');
            expect(titles).toContain('A qPCR Deep Dive');
        });

        test('each section id should point to the correct file path', () => {
            const sectionSets = qpcrSets.filter(s => s.id !== 'qPCR.json');
            sectionSets.forEach(set => {
                expect(set.id).toMatch(/^data\/qpcr\/.+\.json$/);
            });
        });
    });

    describe('digitalPcrSets', () => {
        test('should export digitalPcrSets with 1 entry', () => {
            expect(digitalPcrSets).toBeDefined();
            expect(digitalPcrSets).toHaveLength(1);
        });

        test('should contain the General Digital PCR (dPCR) Quiz', () => {
            expect(digitalPcrSets[0].id).toBe('data/digital-pcr/Digital PCR.json');
            expect(digitalPcrSets[0].title).toBe('General Digital PCR (dPCR) Quiz');
        });
    });

    test('labTechniques should contain Digital PCR', () => {
        const dpcr = labTechniques.find(tech => tech.id === 'digital-pcr');
        expect(dpcr).toBeDefined();
        expect(dpcr.title).toBe('Digital PCR');
        expect(dpcr.icon).toBe('💧🔢');
        expect(dpcr.comingSoon).toBe(false);
    });
});
