// src/quizModel.js

/**
 * Manages the state and logic of the quiz.
 */
export const QuizModel = {
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    questionUrl: 'Set-1-questions.json', // Default question set

    // --- Timer Variables (controlled by app.js, but state managed here for clarity) ---
    TIME_PER_QUESTION: 20,
    TIME_PER_CALCULATION_QUESTION: 60,
    timeLeft: 20, // Initial value, will be set by startTimer

    resetState: function() {
        this.currentQuestionIndex = 0;
        this.score = 0;
    },

    /**
     * Loads quiz data from the specified URL.
     * @param {string} url - The URL to fetch quiz data from.
     * @returns {Promise<boolean>} - True if data loaded successfully, false otherwise.
     */
    loadQuizData: async function(url = this.questionUrl) {
        this.questionUrl = url; // Update questionUrl if a new one is provided
        try {
            if (!this.questionUrl) {
                console.error("Invalid questionUrl:", this.questionUrl);
                return false;
            }
            const response = await fetch(this.questionUrl);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            
            this.currentQuestions = await response.json();
            if (!Array.isArray(this.currentQuestions) || this.currentQuestions.length === 0) {
                throw new Error("Loaded data is not a valid question array or is empty.");
            }
            return true;
        } catch (error) {
            console.error("Error loading the questions:", error);
            this.currentQuestions = []; // Clear questions on error
            return false;
        }
    },

    /**
     * Advances to the next question or finishes the quiz.
     * @returns {object|null} The next question object, or null if quiz finished.
     */
    getNextQuestion: function() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            return this.currentQuestions[this.currentQuestionIndex];
        } else {
            return null; // Quiz finished
        }
    },

    /**
     * Gets the current question.
     * @returns {object|null} The current question object, or null if no questions.
     */
    getCurrentQuestion: function() {
        if (this.currentQuestions.length > 0 && this.currentQuestionIndex < this.currentQuestions.length) {
            return this.currentQuestions[this.currentQuestionIndex];
        }
        return null;
    },

    /**
     * Checks if the selected answer is correct and updates the score.
     * @param {string} selectedAnswer - The answer selected by the user.
     * @returns {boolean} True if the answer is correct, false otherwise.
     */
    checkAnswer: function(selectedAnswer) {
        const currentQuestion = this.getCurrentQuestion();
        if (currentQuestion && selectedAnswer === currentQuestion.answer) {
            this.score++;
            return true;
        }
        return false;
    },

    getScore: function() {
        return this.score;
    },

    getTotalQuestions: function() {
        return this.currentQuestions.length;
    },

    getQuestionExplanation: function() {
        const currentQuestion = this.getCurrentQuestion();
        return currentQuestion ? currentQuestion.explanation : "";
    },

    getQuestionOptions: function() {
        const currentQuestion = this.getCurrentQuestion();
        return currentQuestion ? currentQuestion.options : [];
    }
};
