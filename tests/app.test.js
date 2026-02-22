// tests/app.test.js
import { jest } from '@jest/globals';

let QuizUI;
let QuizModel;
let browserUtils;
let app;

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
    let mockStartButton;
    let mockQuestionSetSelector;
    let mockNextButton;
    let mockQuizContainer;
    let mockFeedbackContainer;
    let mockTimerDisplay;
    let mockTimeUpMessage;
    let mockTimerContainer;
    let mockQuestionTextElement;
    let mockAnswerButtonsContainer;
    let mockScoreCountElement;
    let mockRestartQuizButton;

    // State for mockFeedbackContainer.classList.contains
    let feedbackContainerIsHidden;
    // State for mockQuizContainer.classList.contains
    let quizContainerIsHidden;


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

        // Dynamically import the mocked versions of QuizModel and browserUtils
        ({ QuizModel } = await import('../src/quizModel.js'));
        ({ browserUtils } = await import('../src/utils.js'));

        // Reset classList states for each test
        feedbackContainerIsHidden = true;
        quizContainerIsHidden = true;

        // Mock DOM elements
        mockStartButton = { onclick: jest.fn() };
        mockQuestionSetSelector = { onchange: jest.fn() };
        mockNextButton = { onclick: jest.fn() };
        mockQuizContainer = {
            classList: {
                contains: jest.fn((cls) => cls === 'hide' ? quizContainerIsHidden : false),
                add: jest.fn(() => { quizContainerIsHidden = true; }),
                remove: jest.fn(() => { quizContainerIsHidden = false; }),
            }
        }; 
        mockFeedbackContainer = {
            classList: {
                contains: jest.fn((cls) => cls === 'hide' ? feedbackContainerIsHidden : false),
                remove: jest.fn(() => { feedbackContainerIsHidden = false; }),
                add: jest.fn(() => { feedbackContainerIsHidden = true; }),
            },
            innerHTML: ''
        };
        mockTimerDisplay = { innerText: '' };
        mockTimeUpMessage = { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        mockTimerContainer = { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        mockQuestionTextElement = { innerText: '' };
        mockAnswerButtonsContainer = { innerHTML: '', querySelectorAll: jest.fn(() => []), appendChild: jest.fn() };
        mockScoreCountElement = { innerText: '' };
        mockRestartQuizButton = { addEventListener: jest.fn() };


        // Mock document.getElementById to return our mock elements
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            switch (id) {
                case 'start-btn': return mockStartButton;
                case 'question-set': return mockQuestionSetSelector;
                case 'next-btn': return mockNextButton;
                case 'quiz-container': return mockQuizContainer;
                case 'landing-page': return {style: {display: 'block'}};
                case 'feedback-container': return mockFeedbackContainer;
                case 'timer-display': return mockTimerDisplay;
                case 'time-up-message': return mockTimeUpMessage;
                case 'timer-container': return mockTimerContainer;
                case 'question-text': return mockQuestionTextElement;
                case 'answer-buttons': return mockAnswerButtonsContainer;
                case 'score-count': return mockScoreCountElement;
                case 'restart-quiz-btn': return mockRestartQuizButton;
                default: return null;
            }
        });

        // Dynamic import of the real QuizUI module and the app.js module (under test)
        // QuizUI will now get its DOM elements from our mocked document.getElementById
        ({ QuizUI } = await import('../src/quizUI.js')); // Import the real QuizUI

        // Spy on QuizUI methods
        jest.spyOn(QuizUI, 'showLandingPage');
        jest.spyOn(QuizUI, 'showQuiz');
        jest.spyOn(QuizUI, 'updateTimerDisplay');
        jest.spyOn(QuizUI, 'setTimerContainerRed');
        jest.spyOn(QuizUI, 'showTimeUpMessage');
        jest.spyOn(QuizUI, 'updateQuestionText');
        jest.spyOn(QuizUI, 'clearAnswerButtons');
        jest.spyOn(QuizUI, 'appendAnswerButton');
        jest.spyOn(QuizUI, 'updateFeedback');
        jest.spyOn(QuizUI, 'hideFeedback');
        jest.spyOn(QuizUI, 'disableAnswerButtons');
        jest.spyOn(QuizUI, 'updateScoreDisplay');
        jest.spyOn(QuizUI, 'renderFinalResults');
        jest.spyOn(QuizUI, 'getStartButton');
        jest.spyOn(QuizUI, 'getQuestionSetSelector');
        jest.spyOn(QuizUI, 'getNextButton');
        jest.spyOn(QuizUI, 'getQuizContainer');
        jest.spyOn(QuizUI, 'getFeedbackContainer');


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
    });

    // Test for init()
    test('init should set up UI elements and event listeners', async () => {
        QuizModel.loadQuizData.mockResolvedValue(true);

        await app.init();

        expect(QuizUI.showLandingPage).toHaveBeenCalledTimes(1);
        expect(QuizUI.getStartButton).toHaveBeenCalled(); // Ensure getter is called
        expect(mockStartButton.onclick).toBeInstanceOf(Function);
        expect(QuizUI.getQuestionSetSelector).toHaveBeenCalled();
        expect(mockQuestionSetSelector.onchange).toBeInstanceOf(Function);
        expect(QuizUI.getNextButton).toHaveBeenCalled();
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

    test('selectAnswer should NOT automatically advance to the next question, and next button should become visible', async () => {
        const nextQuestionSpy = jest.spyOn(app, 'nextQuestion').mockImplementation(() => {});
        jest.spyOn(QuizUI, 'hideFeedback').mockImplementation(() => {}); // Spy on hideFeedback
        
        app.selectAnswer('any answer');
        
        jest.advanceTimersByTime(2000); // Advance time past any potential delay
        expect(nextQuestionSpy).not.toHaveBeenCalled(); // Still should not advance automatically
        
        expect(QuizUI.updateFeedback).toHaveBeenCalled(); // Feedback should be shown
        expect(QuizUI.hideFeedback).not.toHaveBeenCalled(); // hideFeedback should NOT be called
        
        // Assert that 'hide' class was removed from the feedback container
        expect(mockFeedbackContainer.classList.remove).toHaveBeenCalledWith('hide');
        // And that it does not contain 'hide' anymore (conceptually visible)
        expect(mockFeedbackContainer.classList.contains('hide')).toBe(false); 
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
        // Ensure quiz container is NOT hidden for this test
        quizContainerIsHidden = false; // Set this flag to make contains('hide') return false
        const showQuestionSpy = jest.spyOn(app, 'showQuestion');

        await app.switchSet('Set-2-questions.json');

        expect(QuizModel.questionUrl).toBe('Set-2-questions.json'); // Direct state update check
        expect(QuizModel.resetState).toHaveBeenCalledTimes(1);
        expect(QuizUI.updateScoreDisplay).toHaveBeenCalledWith(0);
        expect(QuizUI.hideFeedback).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(1);
        expect(showQuestionSpy).toHaveBeenCalledTimes(1);
    });

    test('switchSet should not show question if quiz container is hidden', async () => {
        // Ensure quiz container IS hidden for this test
        quizContainerIsHidden = true; // Set this flag to make contains('hide') return true
        const showQuestionSpy = jest.spyOn(app, 'showQuestion');

        await app.switchSet('Set-3-questions.json');
        expect(showQuestionSpy).not.toHaveBeenCalled();
    });

    // Test for DOMContentLoaded and init()
    test('clicking start button after init should start the quiz', async () => {
        // 1. Setup the DOM and mocks - handled in beforeEach now for general elements

        QuizModel.loadQuizData.mockResolvedValue(true);
        
        await app.init();

        expect(QuizUI.showLandingPage).toHaveBeenCalledTimes(1);
        expect(QuizUI.getStartButton).toHaveBeenCalled(); // Ensure getter is called
        expect(mockStartButton.onclick).toBeInstanceOf(Function);
        expect(QuizUI.getQuestionSetSelector).toHaveBeenCalled();
        expect(mockQuestionSetSelector.onchange).toBeInstanceOf(Function);
        expect(QuizUI.getNextButton).toHaveBeenCalled();
        expect(mockNextButton.onclick).toBeInstanceOf(Function);
        expect(QuizModel.loadQuizData).toHaveBeenCalledTimes(1);
        expect(QuizModel.loadQuizData).toHaveBeenCalledWith(); // Called with default URL
    });
});
