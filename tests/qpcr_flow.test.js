import { jest } from '@jest/globals';
import { setupDOM } from './setupDOM.js';

// Mock the modules before importing app
jest.unstable_mockModule('../src/quizModel.js', () => ({
    QuizModel: {
        currentQuestions: [],
        currentQuestionIndex: 0,
        score: 0,
        questionUrl: 'Set-1-questions.json',
        TIME_PER_QUESTION: 20,
        TIME_PER_QPCR_QUESTION: 30,
        TIME_PER_CALCULATION_QUESTION: 60,
        timeLeft: 20,
        resetState: jest.fn(),
        loadQuizData: jest.fn(),
        getNextQuestion: jest.fn(),
        getCurrentQuestion: jest.fn(),
        checkAnswer: jest.fn(),
        getScore: jest.fn(() => 0),
        getTotalQuestions: jest.fn(() => 0),
        getQuestionExplanation: jest.fn(),
        getQuestionOptions: jest.fn(() => []),
    }
}));

const { QuizUI } = await import('../src/quizUI.js');
const { QuizModel } = await import('../src/quizModel.js');
const app = (await import('../src/app.js')).default;

describe('qPCR Quiz Flow', () => {
    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
    });

    test('qPCR technique should be enabled and clickable', async () => {
        await app.init();
        const labBenchBtn = document.getElementById('lab-bench-btn');
        labBenchBtn.click();

        const qpcrTile = Array.from(document.querySelectorAll('.technique-tile'))
            .find(tile => tile.textContent.includes('qPCR'));

        expect(qpcrTile).toBeTruthy();
        expect(qpcrTile.classList.contains('coming-soon')).toBe(false);
    });

    test('clicking qPCR tile should show qPCR page with all 7 quiz cards', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const qpcrPage = document.getElementById('qpcr-page');
        expect(qpcrPage).toBeTruthy();
        expect(qpcrPage.classList.contains('hide')).toBe(false);

        // Should have 7 quiz cards total (General + 6 sections)
        const quizCards = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        expect(quizCards.length).toBe(7);
    });

    test('should render General qPCR Quiz card', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const titles = Array.from(tiles).map(t => t.textContent);
        expect(titles).toContain('General qPCR Quiz');
    });

    test('should render all 6 new section titles', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const titles = Array.from(tiles).map(t => t.textContent);

        expect(titles).toContain('Real-Time PCR Fundamentals');
        expect(titles).toContain('The Chemistry of qPCR');
        expect(titles).toContain('Principles and Optimization');
        expect(titles).toContain('The qPCR Essentials Quiz');
        expect(titles).toContain('qPCR Data Analysis & Assay Validation');
        expect(titles).toContain('A qPCR Deep Dive');
    });

    test('clicking a section tile should start the quiz with correct JSON', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Test question',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: 'Test explanation'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        app.handleTechniqueClick('qpcr');

        // Click the "The Chemistry of qPCR" tile
        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const chemistryTile = Array.from(tiles)
            .find(t => t.textContent === 'The Chemistry of qPCR');

        expect(chemistryTile).toBeTruthy();
        chemistryTile.click();

        expect(QuizModel.questionUrl).toBe('data/qpcr/The Chemistry of qPCR.json');
        expect(QuizModel.resetState).toHaveBeenCalled();
        expect(document.getElementById('quiz-container').classList.contains('hide')).toBe(false);
    });

    test('clicking General qPCR Quiz card should start quiz with qPCR.json', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'At what stage...',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: '...'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const generalTile = Array.from(tiles)
            .find(t => t.textContent === 'General qPCR Quiz');

        expect(generalTile).toBeTruthy();
        generalTile.click();

        expect(QuizModel.questionUrl).toBe('qPCR.json');
        expect(QuizModel.resetState).toHaveBeenCalled();
        expect(document.getElementById('quiz-container').classList.contains('hide')).toBe(false);
    });

    test('quiz back button should return to qPCR page', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');
        app.handleQuizBack();

        const qpcrPage = document.getElementById('qpcr-page');
        expect(qpcrPage.classList.contains('hide')).toBe(false);
    });

    test('qPCR quiz cards should have the qpcr-quiz-card class', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        tiles.forEach(tile => {
            expect(tile.classList.contains('qpcr-quiz-card')).toBe(true);
        });
    });

    test('qPCR quiz should start with a 30-second timer', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const generalTile = Array.from(tiles)
            .find(t => t.textContent === 'General qPCR Quiz');

        generalTile.click();

        // This should fail as CURRENTLY it is 20
        expect(QuizModel.timeLeft).toBe(30);
    });
});

