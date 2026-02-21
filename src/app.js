// src/app.js
// Import UI functions
import { QuizUI } from './quizUI.js';
import { QuizModel } from './quizModel.js';
import { browserUtils } from './utils.js'; // Import browser utilities

const app = {};

// --- State Variables ---
let timerInterval = null; // Initialize to null

// --- DOM Elements ---
// Removed let declarations for DOM elements

// --- Helper Functions (not exported directly, but used internally) ---


/**
 * Handles the click event for the 'GOOD LUCK!' button.
 */
async function handleStartButtonClick() {
    QuizUI.showQuiz(); // Hide landing page, show quiz
    QuizModel.resetState(); // Reset progress and score
    app.updateScoreDisplay(QuizModel.getScore());
    QuizUI.hideFeedback(); // Hide feedback if visible
    await QuizModel.loadQuizData(); // Ensure we load the selected set
    app.showQuestion(); // Display the first question
}

/**
 * Starts the timer for the current question.
 */
function startTimer() {
    app.stopTimer(); // Always clear previous timer before starting a new one

    // Determine time based on question set (e.g., Set 5 for calculations)
    QuizModel.timeLeft = QuizModel.questionUrl === "Set-5-questions.json" ? QuizModel.TIME_PER_CALCULATION_QUESTION : QuizModel.TIME_PER_QUESTION;
    
    QuizUI.updateTimerDisplay(QuizModel.timeLeft);
    QuizUI.setTimerContainerRed(false); // Remove red/blink classes initially
    QuizUI.showTimeUpMessage(false); // Hide time up message initially

    timerInterval = setInterval(() => {
        QuizModel.timeLeft--;
        QuizUI.updateTimerDisplay(QuizModel.timeLeft);

        if (QuizModel.timeLeft <= 10) {
            QuizUI.setTimerContainerRed(true);
        } else {
            QuizUI.setTimerContainerRed(false);
        }

        if (QuizModel.timeLeft <= 0) {
            app.stopTimer();
            QuizUI.showTimeUpMessage(true);
            // Automatically advance to the next question when time runs out
            app.nextQuestion(); 
        }
    }, 1000);
}

/**
 * Stops the timer.
 */
function stopTimer() {
    if (timerInterval !== null) { // Check if timerInterval is not null
        clearInterval(timerInterval);
        timerInterval = null; // Clear the interval ID
    }
    QuizUI.setTimerContainerRed(false); // Ensure timer is not red/blinking
    QuizUI.showTimeUpMessage(false); // Hide time up message
}

/**
 * Displays the current question and its answer options.
 */
function showQuestion() {
    const question = QuizModel.getCurrentQuestion();
    // Check if question is valid before proceeding
    if (!question) {
        console.error("Invalid state for showing question:", { currentQuestions: QuizModel.currentQuestions, currentQuestionIndex: QuizModel.currentQuestionIndex });
        QuizUI.updateQuestionText("Error: Could not display question.");
        app.stopTimer(); // Ensure timer is stopped if no question can be shown
        return;
    }

    app.startTimer(); // Start the timer for the new question
    
    QuizUI.updateQuestionText(question.question);
    
    QuizUI.clearAnswerButtons(); // Clear previous buttons

    // Ensure options exist and are an array
    if (QuizModel.getQuestionOptions().length > 0) {
        QuizModel.getQuestionOptions().forEach(option => {
            QuizUI.appendAnswerButton(option, () => app.selectAnswer(option));
        });
    } else {
        console.error("Question options are missing or invalid:", question);
        QuizUI.updateQuestionText("Error: No answer options available.");
    }
}

/**
 * Handles the selection of an answer.
 * @param {string} selected - The selected answer option.
 * @param {string} correct - The correct answer.
 * @param {string} explanation - The explanation for the answMEr.
 */
function selectAnswer(selected) {
    app.stopTimer(); // Stop the timer when an answer is selected
    
    const isCorrect = QuizModel.checkAnswer(selected);
    const explanation = QuizModel.getQuestionExplanation();

    // Check if the answer is correct and update score
    if (isCorrect) {
        QuizUI.updateFeedback(`<strong>Correct!</strong> ${explanation}`, true);
    } else {
        QuizUI.updateFeedback(`<strong>Not quite.</strong> ${explanation}`, false);
    }
    
    app.updateScoreDisplay(QuizModel.getScore());
    QuizUI.disableAnswerButtons(true); // Disable all buttons after an answer is selected
}

/**
 * Updates the score display on the page.
 */
function updateScoreDisplay(currentScore) {
    QuizUI.updateScoreDisplay(currentScore);
}


// --- Export necessary functions using individual export statements ---
async function init() { // Export init
    QuizUI.showLandingPage(); // Start by showing the cover page
    const startButton = QuizUI.getStartButton();
    if (startButton) {
        startButton.onclick = handleStartButtonClick; // Set up the event listener for the start button
    }

    // If the question set selector exists, ensure its event listener is set up.
    const questionSetSelector = QuizUI.getQuestionSetSelector();
    if (questionSetSelector) {
        questionSetSelector.onchange = async (e) => {
            await app.switchSet(e.target.value);
        };
    }

    // Add event listener for the next button
    const nextButton = QuizUI.getNextButton();
    if (nextButton) {
        nextButton.onclick = app.nextQuestion;
    }

    // Load the default quiz set to be ready when the user clicks 'GOOD LUCK!'
    await QuizModel.loadQuizData();
}

async function switchSet(newUrl) { // Export switchSet
    app.stopTimer(); // Stop timer when switching set
    QuizModel.questionUrl = newUrl;
    QuizModel.resetState(); // Reset progress and score
    
    app.updateScoreDisplay(QuizModel.getScore());
    QuizUI.hideFeedback();
    
    // Reload the questions for the new set
    await QuizModel.loadQuizData();

    // If the quiz is currently active (landing page is hidden), show the first question
    const quizContainerElement = QuizUI.getQuizContainer();
    if (quizContainerElement && !quizContainerElement.classList.contains('hide')) {
        app.showQuestion();
    }
}

function nextQuestion() { // Export nextQuestion
    app.stopTimer(); // Stop the timer when advancing to next question or results
    QuizModel.getNextQuestion(); // Advance question index
    if (QuizModel.getCurrentQuestion()) {
        QuizUI.hideFeedback();
        app.showQuestion();
    } else {
        // Final Results Screen
        QuizUI.renderFinalResults(QuizModel.getScore(), QuizModel.getTotalQuestions(), () => browserUtils.reloadPage());
    }
}

Object.assign(app, {
    handleStartButtonClick,
    startTimer,
    stopTimer,
    showQuestion,
    selectAnswer,
    updateScoreDisplay,
    init,
    switchSet,
    nextQuestion,
});

export default app;

