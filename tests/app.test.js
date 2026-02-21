// tests/app.test.js
import { jest } from '@jest/globals';

let QuizUI;
let QuizModel;
let browserUtils;
let app;

// Mock QuizUI module globally
jest.unstable_mockModule('../src/quizUI.js', () => ({
    QuizUI: {
        showLandingPage: jest.fn(),
        showQuiz: jest.fn(),
        getStartButton: jest.fn(),
        getQuestionSetSelector: jest.fn(),
        getNextButton: jest.fn(),
        updateTimerDisplay: jest.fn(),
        setTimerContainerRed: jest.fn(),
        showTimeUpMessage: jest.fn(),
        updateQuestionText: jest.fn(),
        clearAnswerButtons: jest.fn(),
        appendAnswerButton: jest.fn(),
        updateFeedback: jest.fn(),
        hideFeedback: jest.fn(),
        disableAnswerButtons: jest.fn(),
        updateScoreDisplay: jest.fn(),
        getQuizContainer: jest.fn(),
        renderFinalResults: jest.fn(),
    }
}));

// Mock QuizModel module globally
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
        getQuestionOptions: jest.fn(),
    }
}));

// Mock utils module globally
jest.unstable_mockModule('../src/utils.js', () => ({
    browserUtils: {
        reloadPage: jest.fn(),
    },
}));

describe('App Module', () => {
    beforeEach(async () => {
        jest.resetModules(); // Clear the module registry to ensure fresh imports
        jest.useFakeTimers();
        jest.restoreAllMocks(); // Restore all mocks

        // Spy on `clearInterval` and mock `console.error` globally
        jest.spyOn(global, 'clearInterval');
        jest.spyOn(console, 'error').mockImplementation(() => {});

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ questions: [] }),
            })
        );

        // Dynamically import the mocked versions of the dependencies
        ({ QuizUI } = await import('../src/quizUI.js'));
        ({ QuizModel } = await import('../src/quizModel.js'));
        ({ browserUtils } = await import('../src/utils.js'));

        // Dynamic import of the actual app.js module (under test)
        app = (await import('../src/app.js')).default;


        // Reset QuizModel properties that are not mocked functions
        QuizModel.currentQuestions = [];
        QuizModel.currentQuestionIndex = 0;
        QuizModel.score = 0;
        QuizModel.questionUrl = 'Set-1-questions.json';
        QuizModel.timeLeft = 20;

        // Mock return values for QuizModel functions that are called frequently
        QuizModel.getScore.mockReturnValue(0);
        QuizModel.getTotalQuestions.mockReturnValue(0);
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Test Question',
            options: ['Option A', 'Option B'],
            answer: 'Option A',
            explanation: 'Test Explanation'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['Option A', 'Option B']);

        // Mock default behavior for QuizUI elements
        QuizUI.getStartButton.mockReturnValue({ onclick: null });
        QuizUI.getQuestionSetSelector.mockReturnValue({ onchange: null });
        QuizUI.getNextButton.mockReturnValue({ onclick: null });
        QuizUI.getQuizContainer.mockReturnValue({ classList: { contains: jest.fn(() => false) } });
    });

    // Test for init()
    test('init should set up UI elements and event listeners', async () => {
        const mockStartButton = { onclick: jest.fn() };
        const mockQuestionSetSelector = { onchange: jest.fn() };
        const mockNextButton = { onclick: jest.fn() };

        QuizUI.getStartButton.mockReturnValue(mockStartButton);
        QuizUI.getQuestionSetSelector.mockReturnValue(mockQuestionSetSelector);
        QuizUI.getNextButton.mockReturnValue(mockNextButton);
        QuizModel.loadQuizData.mockResolvedValue(true);

        await app.init();

        expect(QuizUI.showLandingPage).toHaveBeenCalledTimes(1);
        expect(QuizUI.getStartButton).toHaveBeenCalledTimes(1);
        expect(mockStartButton.onclick).toBeInstanceOf(Function);
        expect(QuizUI.getQuestionSetSelector).toHaveBeenCalledTimes(1);
        expect(mockQuestionSetSelector.onchange).toBeInstanceOf(Function);
        expect(QuizUI.getNextButton).toHaveBeenCalledTimes(1);
        expect(mockNextButton.onclick).toBeInstanceOf(Function);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledWith(); // Called with default URL
    });

    // Test for handleStartButtonClick()
    test('handleStartButtonClick should transition to quiz and load first question', async () => {
        QuizModel.loadQuizData.mockResolvedValue(true);

        await app.handleStartButtonClick();

        expect(QuizUI.showQuiz).toHaveBeenCalledTimes(1);
        expect(QuizModel.resetState).toHaveBeenCalledTimes(1);
        expect(QuizUI.updateScoreDisplay).toHaveBeenCalledWith(0); // Initial score
        expect(QuizUI.hideFeedback).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(1);
    });

    // Test for showQuestion()
    test('showQuestion should display current question and options', () => {
        const mockQuestion = {
            question: 'What is the capital of France?',
            options: ['Paris', 'London'],
            answer: 'Paris',
            explanation: 'It is Paris.'
        };
        QuizModel.getCurrentQuestion.mockReturnValue(mockQuestion);
        QuizModel.getQuestionOptions.mockReturnValue(mockQuestion.options);

        app.showQuestion();

        expect(QuizUI.updateQuestionText).toHaveBeenCalledWith(mockQuestion.question);
        expect(QuizUI.clearAnswerButtons).toHaveBeenCalledTimes(1);
        expect(QuizUI.appendAnswerButton).toHaveBeenCalledTimes(mockQuestion.options.length);
        expect(QuizUI.appendAnswerButton).toHaveBeenCalledWith('Paris', expect.any(Function));
        expect(QuizUI.appendAnswerButton).toHaveBeenCalledWith('London', expect.any(Function));
    });

    test('showQuestion should handle no current question gracefully', () => {
        QuizModel.getCurrentQuestion.mockReturnValue(null); // No current question
        const stopTimerSpy = jest.spyOn(app, 'stopTimer');
        app.showQuestion();

        expect(QuizUI.updateQuestionText).toHaveBeenCalledWith("Error: Could not display question.");
        expect(stopTimerSpy).toHaveBeenCalled();
    });

    test('showQuestion should handle no options gracefully', () => {
        const mockQuestion = {
            question: 'Question with no options?',
            options: [],
            answer: '',
            explanation: ''
        };
        QuizModel.getCurrentQuestion.mockReturnValue(mockQuestion);
        QuizModel.getQuestionOptions.mockReturnValue([]); // No options

        app.showQuestion();

        expect(QuizUI.updateQuestionText).toHaveBeenCalledWith(mockQuestion.question);
        expect(QuizUI.clearAnswerButtons).toHaveBeenCalledTimes(1);
        expect(QuizUI.appendAnswerButton).not.toHaveBeenCalled();
        expect(QuizUI.updateQuestionText).toHaveBeenCalledWith("Error: No answer options available.");
    });


    // Test for selectAnswer()
    test('selectAnswer should check answer, update UI, and disable buttons', () => {
        QuizModel.checkAnswer.mockReturnValue(true);
        QuizModel.getQuestionExplanation.mockReturnValue('Correct!');
        QuizModel.getScore.mockReturnValue(1);

        app.selectAnswer('Option A');

        expect(QuizModel.checkAnswer).toHaveBeenCalledWith('Option A');
        expect(QuizModel.getQuestionExplanation).toHaveBeenCalledTimes(1);
        expect(QuizUI.updateFeedback).toHaveBeenCalledWith('<strong>Correct!</strong> Correct!', true);
        expect(QuizUI.updateScoreDisplay).toHaveBeenCalledWith(1);
        expect(QuizUI.disableAnswerButtons).toHaveBeenCalledWith(true);
    });

    test('selectAnswer should handle incorrect answer', () => {
        QuizModel.checkAnswer.mockReturnValue(false);
        QuizModel.getQuestionExplanation.mockReturnValue('Incorrect!');
        QuizModel.getScore.mockReturnValue(0);
        app.selectAnswer('Option B');

        expect(QuizModel.checkAnswer).toHaveBeenCalledWith('Option B');
        expect(QuizModel.getQuestionExplanation).toHaveBeenCalledTimes(1);
        expect(QuizUI.updateFeedback).toHaveBeenCalledWith('<strong>Not quite.</strong> Incorrect!', false);
        expect(QuizUI.updateScoreDisplay).toHaveBeenCalledWith(0);
        expect(QuizUI.disableAnswerButtons).toHaveBeenCalledWith(true);
    });

    test('selectAnswer should automatically advance to the next question after a delay', () => {
        const nextQuestionSpy = jest.spyOn(app, 'nextQuestion').mockImplementation(() => {});
        app.selectAnswer('any answer');
        expect(nextQuestionSpy).not.toHaveBeenCalled(); // It should not be called immediately
        jest.advanceTimersByTime(1500); // Fast-forward time by 1.5 seconds
        expect(nextQuestionSpy).toHaveBeenCalled();
    });

    // Test for nextQuestion()
    test('nextQuestion should advance to next question if available', () => {
        QuizModel.getCurrentQuestion.mockReturnValueOnce({ /* next question */ }); // Indicate next question exists
        const showQuestionSpy = jest.spyOn(app, 'showQuestion');

        app.nextQuestion();

        expect(QuizModel.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(QuizUI.hideFeedback).toHaveBeenCalledTimes(1);
        expect(showQuestionSpy).toHaveBeenCalledTimes(1);
    });

    test('nextQuestion should render final results if no more questions', () => {
        QuizModel.getCurrentQuestion.mockReturnValue(null); // Indicate no more questions
        QuizModel.getScore.mockReturnValue(5);
        QuizModel.getTotalQuestions.mockReturnValue(10);

        app.nextQuestion();

        expect(QuizModel.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(QuizUI.renderFinalResults).toHaveBeenCalledWith(5, 10, expect.any(Function));
    });

    // Test for switchSet()
    test('switchSet should update question URL, reset state, and reload questions', async () => {
        const newUrl = 'Set-2-questions.json';
        QuizModel.loadQuizData.mockResolvedValue(true);
        QuizUI.getQuizContainer.mockReturnValue({ classList: { contains: jest.fn(() => false) } }); // Quiz not hidden
        const showQuestionSpy = jest.spyOn(app, 'showQuestion');

        await app.switchSet(newUrl);

        expect(QuizModel.questionUrl).toBe(newUrl); // Direct state update check
        expect(QuizModel.resetState).toHaveBeenCalledTimes(1);
        expect(QuizUI.updateScoreDisplay).toHaveBeenCalledWith(0);
        expect(QuizUI.hideFeedback).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(1);
        expect(showQuestionSpy).toHaveBeenCalledTimes(1);
    });

    test('switchSet should not show question if quiz container is hidden', async () => {
        const newUrl = 'Set-3-questions.json';
        QuizModel.loadQuizData.mockResolvedValue(true);
        QuizUI.getQuizContainer.mockReturnValue({ classList: { contains: jest.fn(() => true) } }); // Quiz hidden
        const showQuestionSpy = jest.spyOn(app, 'showQuestion');

        await app.switchSet(newUrl);
        expect(showQuestionSpy).not.toHaveBeenCalled();
    });

    // Test for DOMContentLoaded and init()
    test('clicking start button after init should start the quiz', async () => {
        // 1. Setup the DOM and mocks
        const mockStartButton = { onclick: null }; // Start with null onclick
        QuizUI.getStartButton.mockReturnValue(mockStartButton);
        QuizUI.getQuestionSetSelector.mockReturnValue({ onchange: null });
        QuizUI.getNextButton.mockReturnValue({ onclick: null });
        QuizModel.loadQuizData.mockResolvedValue(true);
        QuizModel.getCurrentQuestion.mockReturnValue({
            question: 'Test Question',
            options: ['A', 'B'],
            answer: 'A',
            explanation: 'It is A.'
        });
        QuizModel.getQuestionOptions.mockReturnValue(['A', 'B']);
    
        // 2. Run init() to attach the event listener
        await app.init();
    
        // Ensure the handler was attached
        expect(mockStartButton.onclick).toBeInstanceOf(Function);
    
        // 3. Simulate the button click
        await mockStartButton.onclick();
    
        // 4. Assert the expected outcomes
        expect(QuizUI.showQuiz).toHaveBeenCalledTimes(1);
        expect(QuizModel.resetState).toHaveBeenCalledTimes(1);
        expect(QuizUI.hideFeedback).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(2); // Once in init, once in handler
        expect(QuizUI.updateQuestionText).toHaveBeenCalledWith('Test Question');
    });
});
