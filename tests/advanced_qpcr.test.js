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
        TIME_PER_ADVANCED_QPCR_QUESTION: 60,
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
        getQuestionTimeLimit: jest.fn(() => 60),
    }
}));

const { QuizUI } = await import('../src/quizUI.js');
const { QuizModel } = await import('../src/quizModel.js');
const app = (await import('../src/app.js')).default;

describe('Advanced qPCR Quiz', () => {
    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
    });

    test('should render Mastering the Ct: qPCR Advanced Quiz card', async () => {
        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const titles = Array.from(tiles).map(t => t.textContent);
        expect(titles).toContain('Mastering the Ct: qPCR Advanced Quiz');
    });

    test('clicking Mastering the Ct tile should start quiz with correct JSON and 60s timer', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Advanced question',
            options: ['A', 'B', 'C', 'D'],
            answer: 'C',
            explanation: 'Advanced explanation'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        app.handleTechniqueClick('qpcr');

        const tiles = document.querySelectorAll('#qpcr-sets-grid .set-tile');
        const advancedTile = Array.from(tiles)
            .find(t => t.textContent === 'Mastering the Ct: qPCR Advanced Quiz');

        expect(advancedTile).toBeTruthy();
        advancedTile.click();

        expect(QuizModel.questionUrl).toBe('data/qpcr/Mastering the Ct.json');

        // Check if app.js calls getQuestionTimeLimit and sets timeLeft
        expect(QuizModel.getQuestionTimeLimit()).toBe(60);
    });
});
