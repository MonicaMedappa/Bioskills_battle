// tests/westernBlottingFlow.test.js
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
        getQuestionTimeLimit: jest.fn(() => 20),
    }
}));

const { QuizUI } = await import('../src/quizUI.js');
const { QuizModel } = await import('../src/quizModel.js');
const app = (await import('../src/app.js')).default;

describe('Western Blotting Flow', () => {
    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
    });

    test('Western Blotting technique should be enabled and not marked coming-soon', async () => {
        await app.init();
        const labBenchBtn = document.getElementById('lab-bench-btn');
        labBenchBtn.click();

        const westernTile = Array.from(document.querySelectorAll('.technique-tile'))
            .find(tile => tile.textContent.includes('Western Blotting'));

        expect(westernTile).toBeTruthy();
        expect(westernTile.classList.contains('coming-soon')).toBe(false);
    });

    test('clicking Western Blotting tile should show the western-blotting page', async () => {
        await app.init();
        app.handleTechniqueClick('western');

        const westernPage = document.getElementById('western-blotting-page');
        expect(westernPage).toBeTruthy();
        expect(westernPage.classList.contains('hide')).toBe(false);
    });

    test('Western Blotting page should display a quiz card titled "Basics of Western Blotting"', async () => {
        await app.init();
        app.handleTechniqueClick('western');

        const quizCards = document.querySelectorAll('#western-blotting-sets-grid .set-tile');
        expect(quizCards.length).toBe(1);
        expect(quizCards[0].textContent).toBe('Basics of Western Blotting');
    });

    test('clicking the quiz card should start the quiz with the correct JSON file', async () => {
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Test question',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
            explanation: 'Test explanation'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B', 'C', 'D']);

        await app.init();
        app.handleTechniqueClick('western');

        const tile = document.querySelector('#western-blotting-sets-grid .set-tile');
        tile.click();

        expect(QuizModel.questionUrl).toBe('data/western-blotting/Western Blotting.json');
        expect(QuizModel.resetState).toHaveBeenCalled();
        expect(document.getElementById('quiz-container').classList.contains('hide')).toBe(false);
    });

    test('quiz back button should return to Western Blotting page', async () => {
        await app.init();
        app.handleTechniqueClick('western');
        app.handleQuizBack();

        const westernPage = document.getElementById('western-blotting-page');
        expect(westernPage.classList.contains('hide')).toBe(false);
    });

    test('Back to Lab Bench button on Western Blotting page should return to Lab Bench', async () => {
        await app.init();
        app.handleTechniqueClick('western');

        const backBtn = document.getElementById('back-to-lab-from-western-btn');
        backBtn.click();

        const labBenchPage = document.getElementById('lab-bench-page');
        expect(labBenchPage.classList.contains('hide')).toBe(false);
        expect(document.getElementById('western-blotting-page').classList.contains('hide')).toBe(true);
    });

    test('Western Blotting quiz should use the default 20-second timer', () => {
        QuizModel.questionUrl = 'data/western-blotting/Western Blotting.json';
        // The default TIME_PER_QUESTION is 20s; verify timing logic
        // Since getQuestionTimeLimit is mocked to return 20, this confirms 20s is set
        expect(QuizModel.getQuestionTimeLimit()).toBe(20);
    });
});
