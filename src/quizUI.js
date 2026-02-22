// src/quizUI.js

/**
 * Provides an interface for all UI manipulations related to the quiz.
 * All functions here directly interact with the DOM.
 */

export const QuizUI = {
    // --- Getters for DOM Elements ---
    getTimerDisplay: () => document.getElementById('timer-display'),
    getTimeUpMessage: () => document.getElementById('time-up-message'),
    getTimerContainer: () => document.getElementById('timer-container'),
    getQuestionTextElement: () => document.getElementById('question-text'),
    getAnswerButtonsContainer: () => document.getElementById('answer-buttons'),
    getFeedbackContainer: () => document.getElementById('feedback-container'),
    getFeedbackTextElement: () => document.getElementById('feedback-text'),
    getQuestionSetSelector: () => document.getElementById('question-set'),
    getScoreCountElement: () => document.getElementById('score-count'),
    getStartButton: () => document.getElementById('start-btn'),
    getLandingPage: () => document.getElementById('landing-page'),
    getQuizContainer: () => document.getElementById('quiz-container'),
    getRestartQuizButton: () => document.getElementById('restart-quiz-btn'),
    getNextButton: () => document.getElementById('next-btn'),
    getSdsPage: () => document.getElementById('sds-page'),
    getSetTiles: () => document.querySelectorAll('.set-tile'),


    // --- UI Update Functions ---
    updateTimerDisplay: (timeLeft) => {
        const timerDisplay = QuizUI.getTimerDisplay();
        if (timerDisplay) timerDisplay.innerText = String(timeLeft);
    },

    setTimerContainerRed: (isRed) => {
        const timerContainer = QuizUI.getTimerContainer();
        if (timerContainer) {
            if (isRed) {
                timerContainer.classList.add('red');
                timerContainer.classList.add('blink');
            } else {
                timerContainer.classList.remove('red', 'blink');
            }
        }
    },

    showTimeUpMessage: (show) => {
        const timeUpMessage = QuizUI.getTimeUpMessage();
        if (timeUpMessage) {
            if (show) timeUpMessage.classList.remove('hide');
            else timeUpMessage.classList.add('hide');
        }
    },

    updateQuestionText: (text) => {
        const questionTextElement = QuizUI.getQuestionTextElement();
        if (questionTextElement) questionTextElement.innerText = text;
    },

    clearAnswerButtons: () => {
        const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
        if (answerButtonsContainer) answerButtonsContainer.innerHTML = '';
    },

    appendAnswerButton: (option, selectAnswerCallback) => {
        const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
        if (answerButtonsContainer) {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = selectAnswerCallback;
            answerButtonsContainer.appendChild(button);
        }
    },

    updateFeedback: (message, isCorrect) => {
        const feedbackContainer = QuizUI.getFeedbackContainer();
        const feedbackTextElement = QuizUI.getFeedbackTextElement();
        if (feedbackContainer && feedbackTextElement) {
            feedbackTextElement.innerHTML = message;
            feedbackContainer.classList.remove('hide');
        }
    },

    hideFeedback: () => {
        const feedbackContainer = QuizUI.getFeedbackContainer();
        if (feedbackContainer) feedbackContainer.classList.add('hide');
    },

    disableAnswerButtons: (disable) => {
        const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
        if (answerButtonsContainer) {
            const buttons = answerButtonsContainer.querySelectorAll('button');
            buttons.forEach(btn => btn.disabled = disable);
        }
    },

    updateScoreDisplay: (score) => {
        const scoreCountElement = QuizUI.getScoreCountElement();
        if (scoreCountElement) scoreCountElement.innerText = `Score: ${score}`;
    },

    showLandingPage: () => {
        const landingPage = QuizUI.getLandingPage();
        const quizContainer = QuizUI.getQuizContainer();
        const sdsPage = QuizUI.getSdsPage();
        if (landingPage) landingPage.classList.remove('hide');
        if (quizContainer) quizContainer.classList.add('hide');
        if (sdsPage) sdsPage.classList.add('hide');
    },

    showSdsPage: () => {
        const landingPage = QuizUI.getLandingPage();
        const quizContainer = QuizUI.getQuizContainer();
        const sdsPage = QuizUI.getSdsPage();
        if (landingPage) landingPage.classList.add('hide');
        if (quizContainer) quizContainer.classList.add('hide');
        if (sdsPage) sdsPage.classList.remove('hide');
    },

    showQuiz: () => {
        const landingPage = QuizUI.getLandingPage();
        const quizContainer = QuizUI.getQuizContainer();
        const sdsPage = QuizUI.getSdsPage();
        if (landingPage) landingPage.classList.add('hide');
        if (quizContainer) quizContainer.classList.remove('hide');
        if (sdsPage) sdsPage.classList.add('hide');
    },

    renderFinalResults: (score, totalQuestions, reloadPageCallback) => {
        const quizContainer = QuizUI.getQuizContainer();
        if (quizContainer) {
            quizContainer.innerHTML = `
                <h1>Quiz Complete!</h1>
                <p>Your final score is ${score} out of ${totalQuestions}.</p>
                <p>Keep practicing your Bio-skills!</p>
                <button id="restart-quiz-btn" style="margin-top: 20px;">Restart Quiz</button>
            `;
            const restartButton = QuizUI.getRestartQuizButton();
            if (restartButton) {
                restartButton.addEventListener('click', reloadPageCallback);
            }
        }
    }
};