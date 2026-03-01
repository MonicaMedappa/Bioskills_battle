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
    getArticleSetsPage: () => document.getElementById('article-sets-page'),
    getArticleSetsGrid: () => document.getElementById('article-sets-grid'),
    getBackToLibraryButton: () => document.getElementById('back-to-library-btn'),
    getQuizBackButton: () => document.getElementById('quiz-back-btn'),


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
            QuizUI.getArticleSetsPage(),
            QuizUI.getLabBenchPage(),
            QuizUI.getLibraryPage(),
            QuizUI.getBattleHubModal()
        ];
        pages.forEach(page => {
            if (page) page.classList.add('hide');
        });
    },

    showLandingPage: () => {
        QuizUI.showPage('landing-page');
    },

    showSdsPage: () => {
        QuizUI.showPage('sds-page');
    },

    showQuiz: () => {
        QuizUI.showPage('quiz-container');
    },

    showLabBenchPage: () => {
        QuizUI.showPage('lab-bench-page');
    },

    showLibraryPage: () => {
        QuizUI.showPage('library-page');
    },

    showBattleHubModal: (show) => {
        const modal = QuizUI.getBattleHubModal();
        if (modal) {
            if (show) modal.classList.remove('hide');
            else modal.classList.add('hide');
        }
    },

    showArticleSetsPage: () => {
        QuizUI.showPage('article-sets-page');
    },

    showPage: (pageId) => {
        QuizUI.hideAllPages();
        const page = document.getElementById(pageId);
        if (page) page.classList.remove('hide');
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
            console.log('Rendering article:', article.id, article);
            const card = document.createElement('div');
            card.className = 'article-card';
            if (article.comingSoon) {
                card.classList.add('coming-soon');
            }

            card.innerHTML = `
                <div class="card-content">
                    <span class="article-category">${article.journal || 'Scientific Peer-Review'}</span>
                    <h3 class="article-title">${article.title}</h3>
                    
                    <div class="article-meta-expandable">
                        <div class="meta-item"><strong>Authors:</strong> ${article.author || 'Not specified'}</div>
                        <div class="meta-item"><strong>University:</strong> ${article.university || 'Not specified'}</div>
                        <div class="meta-item"><strong>Published:</strong> ${article.year || 'N/A'}</div>
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

    renderArticleSetsGrid: (sets, handleSetClick) => {
        const grid = QuizUI.getArticleSetsGrid();
        if (!grid) return;

        grid.innerHTML = '';
        sets.forEach(set => {
            const tile = document.createElement('button');
            tile.className = 'set-tile';
            tile.textContent = set.title;
            tile.onclick = () => handleSetClick(set.id);
            grid.appendChild(tile);
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