import { jest } from '@jest/globals';

let QuizUI;
let QuizModel;
let app;

// Mock QuizModel module
jest.unstable_mockModule('../src/quizModel.js', () => ({
    QuizModel: {
        currentQuestions: [],
        currentQuestionIndex: 0,
        score: 0,
        questionUrl: 'Set-1-questions.json',
        timeLeft: 20,
        resetState: jest.fn(),
        loadQuizData: jest.fn(),
        getNextQuestion: jest.fn(),
        getCurrentQuestion: jest.fn(),
        checkAnswer: jest.fn(),
        getScore: jest.fn(() => 0),
        getTotalQuestions: jest.fn(() => 0),
        getQuestionExplanation: jest.fn(),
        getQuestionOptions: jest.fn(),
    }
}));

// Mock utils module
jest.unstable_mockModule('../src/utils.js', () => ({
    browserUtils: {
        reloadPage: jest.fn(),
    },
}));

// Mock data module
jest.unstable_mockModule('../src/data.js', () => ({
    labTechniques: [],
    libraryArticles: [],
    articleSets: {}
}));

describe('Feature 1: Quiz Back Button', () => {
    let mockQuizBackButton;

    beforeEach(async () => {
        jest.resetModules();
        jest.useFakeTimers();

        mockQuizBackButton = { onclick: jest.fn() };

        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'quiz-back-btn') return mockQuizBackButton;
            return { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        });

        ({ QuizModel } = await import('../src/quizModel.js'));
        ({ QuizUI } = await import('../src/quizUI.js'));

        jest.spyOn(QuizUI, 'showSdsPage');
        jest.spyOn(QuizUI, 'showArticleSetsPage');
        jest.spyOn(QuizUI, 'showQuiz');
        jest.spyOn(QuizUI, 'getQuizBackButton').mockReturnValue(mockQuizBackButton);
        jest.spyOn(QuizUI, 'hideFeedback');

        app = (await import('../src/app.js')).default;
    });

    test('handleTileClick should track origin of quiz from SDS-PAGE', async () => {
        // Simulate navigation to SDS-PAGE
        app.handleTechniqueClick('sds-page');

        await app.handleTileClick('Set-1-questions.json');

        app.handleQuizBack();

        expect(QuizUI.showSdsPage).toHaveBeenCalled();
    });

    test('handleTileClick should track origin of quiz from Article Sets', async () => {
        // Articles call handleTileClick too. We need to distinguish.
        // In app.js, article clicks call handleArticleClick which then leads to handleTileClick.
        // We might need to set the origin in the click handlers.

        // Setup origin
        app.setQuizOrigin('article-sets-page');
        await app.handleTileClick('Article-Set-1.json');

        app.handleQuizBack();

        expect(QuizUI.showArticleSetsPage).toHaveBeenCalled();
    });

    test('handleQuizBack should stop timer', () => {
        const stopTimerSpy = jest.spyOn(app, 'stopTimer');
        app.handleQuizBack();
        expect(stopTimerSpy).toHaveBeenCalled();
    });
});
