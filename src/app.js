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
 * Handles the click event for the 'Choose your Battle Hub' button.
 * Shows the Battle Hub modal.
 */
function handleChooseHubButtonClick() {
    QuizUI.showBattleHubModal(true);
}

const labTechniques = [
    { id: 'sds-page', title: 'SDS-PAGE', icon: '🧬', comingSoon: false },
    { id: 'dna-gel', title: 'DNA Gel Electrophoresis', icon: '🧪', comingSoon: true },
    { id: 'pcr', title: 'Polymerase Chain Reaction', icon: '⚗️', comingSoon: true },
    { id: 'qpcr', title: 'qPCR', icon: '📊', comingSoon: true },
    { id: 'ph', title: 'pH', icon: '💧', comingSoon: true },
    { id: 'spec', title: 'OD and Spectrophotometer', icon: '🔦', comingSoon: true },
    { id: 'rt-pcr', title: 'RT-PCR', icon: '🧬', comingSoon: true },
    { id: 'elisa', title: 'ELISA', icon: '🧫', comingSoon: true },
    { id: 'western', title: 'Western Blotting', icon: '🩹', comingSoon: true },
    { id: 'cloning', title: 'Cloning', icon: '🐑', comingSoon: true }
];

/**
 * Handles the click event for the 'The Lab Bench' button in the modal.
 */
function handleLabBenchButtonClick() {
    QuizUI.showBattleHubModal(false);
    QuizUI.showLabBenchPage();
    QuizUI.renderTechniquesGrid(labTechniques, app.handleTechniqueClick);
}

/**
 * Handles clicking a technique tile.
 * @param {string} techniqueId - The ID of the selected technique.
 */
function handleTechniqueClick(techniqueId) {
    if (techniqueId === 'sds-page') {
        QuizUI.showSdsPage();
    }
}

const libraryArticles = [
    {
        id: 'trichinellosis',
        title: 'Trichinellosis: A zoonosis that still requires vigilance',
        author: 'Ivana Mitic, Sasa Vasilev, Alisa Gruden-Movsesijan',
        university: 'University of Belgrade',
        journal: 'Plos Neglected Tropical Diseases',
        year: 'Jan, 2026',
        comingSoon: false
    }
];

const articleSets = {
    'trichinellosis': [
        { id: 'data/library/trichinellosis/Set-1.json', title: 'Set 1' },
        { id: 'data/library/trichinellosis/Set-2.json', title: 'Set 2' },
        { id: 'data/library/trichinellosis/Set-3.json', title: 'Set 3' },
        { id: 'data/library/trichinellosis/Set-4.json', title: 'Set 4' },
        { id: 'data/library/trichinellosis/Set-5.json', title: 'Set 5' },
        { id: 'data/library/trichinellosis/Set-6.json', title: 'Set 6' }
    ]
};

/**
 * Handles the click event for the 'The Library' button in the modal.
 */
function handleLibraryButtonClick() {
    QuizUI.showBattleHubModal(false);
    QuizUI.showLibraryPage();
    QuizUI.renderArticlesGrid(libraryArticles, app.handleArticleClick);
}

/**
 * Handles clicking an article card.
 * @param {string} articleId - The ID of the selected article.
 */
function handleArticleClick(articleId) {
    const sets = articleSets[articleId];
    if (sets) {
        QuizUI.showArticleSetsPage();
        QuizUI.renderArticleSetsGrid(sets, app.handleTileClick);
        const titleElem = document.getElementById('article-sets-title');
        const article = libraryArticles.find(a => a.id === articleId);
        if (titleElem && article) {
            titleElem.textContent = article.title;
        }
    }
}

/**
 * Handles clicking a set tile on the SDS-PAGE.
 * @param {string} setUrl - The JSON filename for the selected set.
 */
async function handleTileClick(setUrl) {
    QuizModel.questionUrl = setUrl;
    QuizModel.resetState();
    app.updateScoreDisplay(QuizModel.getScore());
    QuizUI.hideFeedback();
    QuizUI.showQuiz();
    await QuizModel.loadQuizData();
    app.showQuestion();
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
    app.stopTimer();

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
async function init() {
    QuizUI.showLandingPage(); // Start by showing the cover page

    // Set up Choose Hub button
    const chooseHubBtn = QuizUI.getChooseHubButton();
    if (chooseHubBtn) {
        chooseHubBtn.onclick = handleChooseHubButtonClick;
    }

    // Set up Hub options in modal
    const labBenchBtn = QuizUI.getLabBenchButton();
    if (labBenchBtn) {
        labBenchBtn.onclick = handleLabBenchButtonClick;
    }

    const libraryBtn = QuizUI.getLibraryButton();
    if (libraryBtn) {
        libraryBtn.onclick = handleLibraryButtonClick;
    }

    const closeModalBtn = QuizUI.getCloseModalButton();
    if (closeModalBtn) {
        closeModalBtn.onclick = () => QuizUI.showBattleHubModal(false);
    }

    // Set up Back buttons
    const backToHomeFromLab = QuizUI.getBackToHomeFromLab();
    if (backToHomeFromLab) {
        backToHomeFromLab.onclick = () => QuizUI.showLandingPage();
    }

    const backToHomeFromLibrary = QuizUI.getBackToHomeFromLibrary();
    if (backToHomeFromLibrary) {
        backToHomeFromLibrary.onclick = () => QuizUI.showLandingPage();
    }

    const backToLibraryBtn = QuizUI.getBackToLibraryButton();
    if (backToLibraryBtn) {
        backToLibraryBtn.onclick = () => QuizUI.showLibraryPage();
    }

    // Temporary: link SDS-PAGE directly for now to keep things working
    // In Stage 3, we'll have a grid with a click handler.
    // For now, let's keep the existing SDS-PAGE set tiles logic working if the page is shown.
    const tiles = QuizUI.getSetTiles();
    tiles.forEach(tile => {
        tile.onclick = () => app.handleTileClick(tile.dataset.set);
    });

    // Add event listener for the next button
    const nextButton = QuizUI.getNextButton();
    if (nextButton) {
        nextButton.onclick = app.nextQuestion;
    }
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
    handleChooseHubButtonClick,
    handleLabBenchButtonClick,
    handleLibraryButtonClick,
    handleTechniqueClick,
    handleArticleClick,
    handleTileClick,
    labTechniques,
    libraryArticles,
    startTimer,
    stopTimer,
    showQuestion,
    selectAnswer,
    updateScoreDisplay,
    nextQuestion,
    switchSet,
    init
});

export default app;
