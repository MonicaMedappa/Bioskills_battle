// tests/digitalPcrFlow.test.js
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

describe('Digital PCR Flow', () => {
    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
    });

    test('Digital PCR technique should be enabled and clickable', async () => {
        await app.init();
        const labBenchBtn = document.getElementById('lab-bench-btn');
        labBenchBtn.click();

        const dpcrTile = Array.from(document.querySelectorAll('.technique-tile'))
            .find(tile => tile.textContent.includes('Digital PCR'));

        expect(dpcrTile).toBeTruthy();
        expect(dpcrTile.classList.contains('coming-soon')).toBe(false);
    });

    test('clicking Digital PCR tile should show Digital PCR page with quiz card', async () => {
        await app.init();
        app.handleTechniqueClick('digital-pcr');

        const dpcrPage = document.getElementById('digital-pcr-page');
        expect(dpcrPage).toBeTruthy();
        expect(dpcrPage.classList.contains('hide')).toBe(false);

        const quizCards = document.querySelectorAll('#digital-pcr-sets-grid .set-tile');
        expect(quizCards.length).toBe(1);
        expect(quizCards[0].textContent).toBe('General Digital PCR (dPCR) Quiz');
    });

    test('clicking Digital PCR quiz card should start quiz with correct JSON', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Test question',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: 'Test'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        app.handleTechniqueClick('digital-pcr');

        const tile = document.querySelector('#digital-pcr-sets-grid .set-tile');
        tile.click();

        expect(QuizModel.questionUrl).toBe('data/digital-pcr/Digital PCR.json');
        expect(QuizModel.resetState).toHaveBeenCalled();
        expect(document.getElementById('quiz-container').classList.contains('hide')).toBe(false);
    });

    test('quiz back button should return to Digital PCR page', async () => {
        await app.init();
        app.handleTechniqueClick('digital-pcr');
        app.handleQuizBack();

        const dpcrPage = document.getElementById('digital-pcr-page');
        expect(dpcrPage.classList.contains('hide')).toBe(false);
    });

    test('Digital PCR back to Lab Hub button should return to Lab Bench', async () => {
        await app.init();
        app.handleTechniqueClick('digital-pcr');

        const backBtn = document.getElementById('back-to-lab-from-digital-pcr-btn');
        backBtn.click();

        const labBenchPage = document.getElementById('lab-bench-page');
        expect(labBenchPage.classList.contains('hide')).toBe(false);
        expect(document.getElementById('digital-pcr-page').classList.contains('hide')).toBe(true);
    });
});
