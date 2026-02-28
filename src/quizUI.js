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
    getGameTitle: () => document.getElementById('game-title'),
    getChooseHubButton: () => document.getElementById('choose-hub-btn'),
    getBattleHubModal: () => document.getElementById('battle-hub-modal'),
    getLabBenchButton: () => document.getElementById('lab-bench-btn'),
    getLibraryButton: () => document.getElementById('library-btn'),
    getCloseModalButton: () => document.getElementById('close-modal-btn'),
    getLabBenchPage: () => document.getElementById('lab-bench-page'),
    getLibraryPage: () => document.getElementById('library-page'),
    getBackToHomeFromLab: () => document.getElementById('back-to-home-from-lab'),
    getBackToHomeFromLibrary: () => document.getElementById('back-to-home-from-library'),
    getTechniquesGrid: () => document.getElementById('techniques-grid'),
    getArticlesGrid: () => document.getElementById('articles-grid'),
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
        if (scoreCountElement) {
            scoreCountElement.innerText = `Score: ${score}`;
        }
    },

    // --- Page Visibility Functions ---
    hideAllPages: () => {
        const pages = [
            QuizUI.getLandingPage(),
            QuizUI.getQuizContainer(),
            QuizUI.getSdsPage(),
            QuizUI.getLabBenchPage(),
            QuizUI.getLibraryPage(),
            QuizUI.getBattleHubModal()
        ];
        pages.forEach(page => {
            if (page) page.classList.add('hide');
        });
    },

    showLandingPage: () => {
        QuizUI.hideAllPages();
        const page = QuizUI.getLandingPage();
        if (page) page.classList.remove('hide');
    },

    showSdsPage: () => {
        QuizUI.hideAllPages();
        const page = QuizUI.getSdsPage();
        if (page) page.classList.remove('hide');
    },

    showQuiz: () => {
        QuizUI.hideAllPages();
        const page = QuizUI.getQuizContainer();
        if (page) page.classList.remove('hide');
    },

    showLabBenchPage: () => {
        QuizUI.hideAllPages();
        const page = QuizUI.getLabBenchPage();
        if (page) page.classList.remove('hide');
    },

    showLibraryPage: () => {
        QuizUI.hideAllPages();
        const page = QuizUI.getLibraryPage();
        if (page) page.classList.remove('hide');
    },

    showBattleHubModal: (show) => {
        const modal = QuizUI.getBattleHubModal();
        if (modal) {
            if (show) modal.classList.remove('hide');
            else modal.classList.add('hide');
        }
    },

    renderTechniquesGrid: (techniques, handleTechniqueClick) => {
        const grid = QuizUI.getTechniquesGrid();
        if (!grid) return;

        grid.innerHTML = '';
        techniques.forEach(tech => {
            const tile = document.createElement('div');
            tile.className = 'technique-tile';
            if (tech.comingSoon) {
                tile.classList.add('coming-soon');
            }

            tile.innerHTML = `
                <div class="tile-icon">${tech.icon}</div>
                <div class="tile-title">${tech.title}</div>
                ${tech.comingSoon ? '<div class="coming-soon-badge">Coming Soon</div>' : ''}
            `;

            if (!tech.comingSoon) {
                tile.onclick = () => handleTechniqueClick(tech.id);
            }
            grid.appendChild(tile);
        });
    },

    renderArticlesGrid: (articles, handleArticleClick) => {
        const grid = QuizUI.getArticlesGrid();
        if (!grid) return;

        grid.innerHTML = '';
        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card';
            if (article.comingSoon) {
                card.classList.add('coming-soon');
            }

            card.innerHTML = `
                <div class="card-content">
                    <span class="article-category">Scientific Peer-Review</span>
                    <h3 class="article-title">${article.title}</h3>
                    <div class="article-meta">
                        <span class="article-author">${article.author}</span>
                        <span class="article-date">${article.year}</span>
                    </div>
                    ${article.comingSoon ? '<div class="coming-soon-badge">Coming Soon</div>' : '<button class="read-btn">Start Analysis</button>'}
                </div>
            `;

            if (!article.comingSoon) {
                card.onclick = () => handleArticleClick(article.id);
            }
            grid.appendChild(card);
        });
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