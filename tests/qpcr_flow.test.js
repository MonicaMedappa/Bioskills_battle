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
        // This will fail initially because qpcr is comingSoon: true in data.js
        await app.init();
        const labBenchBtn = document.getElementById('lab-bench-btn');
        labBenchBtn.click();

        const qpcrTile = Array.from(document.querySelectorAll('.technique-tile'))
            .find(tile => tile.textContent.includes('qPCR'));

        expect(qpcrTile).toBeTruthy();
        expect(qpcrTile.classList.contains('coming-soon')).toBe(false);
    });

    test('clicking qPCR tile should show qPCR page with General qPCR Quiz card', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const qpcrPage = document.getElementById('qpcr-page');
        expect(qpcrPage).toBeTruthy();
        expect(qpcrPage.classList.contains('hide')).toBe(false);

        const quizCard = Array.from(document.querySelectorAll('#qpcr-page .set-tile'))
            .find(tile => tile.textContent.includes('General qPCR Quiz'));

        expect(quizCard).toBeTruthy();
    });

    test('clicking General qPCR Quiz card should start quiz with 20s timer', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'At what stage...',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: '...'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        // Simulate clicking the qPCR quiz card
        // We'll need to find it and click it
        const quizCard = document.createElement('button');
        quizCard.className = 'set-tile';
        quizCard.dataset.set = 'qPCR.json';
        quizCard.textContent = 'General qPCR Quiz';

        // In reality, this will be in index.html after our changes
        // For now, let's just test the handler directly if possible, or expect it to be there

        await app.handleTileClick('qPCR.json');

        expect(QuizModel.questionUrl).toBe('qPCR.json');
        expect(QuizModel.resetState).toHaveBeenCalled();
        expect(document.getElementById('quiz-container').classList.contains('hide')).toBe(false);

        // Check timer - it should be 20 for qPCR
        expect(QuizModel.timeLeft).toBe(20);
    });
});
