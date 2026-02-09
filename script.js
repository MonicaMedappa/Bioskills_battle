// script.js - Bioskills Battle Logic

let questionUrl = 'Set-1-questions.json'; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Timer Variables
let timeLeft = 20;
let timerInterval = null;

/**
 * Initial load of the quiz data
 */
async function loadQuiz() {
    try {
        const response = await fetch(questionUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        
        currentQuestions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Error loading the questions:", error);
        const questionText = document.getElementById('question-text');
        if (questionText) questionText.innerText = "Failed to load questions.";
    }
}

/**
 * Switch question sets (if applicable)
 */
async function switchSet(newUrl) {
    questionUrl = newUrl;
    currentQuestionIndex = 0;
    score = 0;
    
    updateScoreDisplay();
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) feedbackContainer.classList.add('hide');
    
    await loadQuiz();
}

/**
 * Timer Logic
 */
function startTimer() {
    clearInterval(timerInterval); 
    timeLeft = 20; 
    
    const secondsDisplay = document.getElementById("seconds");
    if (secondsDisplay) {
        secondsDisplay.innerText = timeLeft;
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        if (secondsDisplay) secondsDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

/**
 * Triggered when the clock hits zero
 */
function handleTimeout() {
    const question = currentQuestions[currentQuestionIndex];
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const flask = document.getElementById('lab-flask');

    // Time out triggers the burn effect
    if (flask) {
        flask.className = ""; // Reset first
        void flask.offsetWidth; // Trigger reflow
        flask.classList.add('burn');
    }

    if (feedbackText) {
        feedbackText.innerHTML = `<strong>⏰ Time's up!</strong> ${question.explanation}`;
    }
    
    if (feedbackContainer) feedbackContainer.classList.remove('hide');

    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Renders the question and resets the UI
 */
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const questionDisplay = document.getElementById('question-text');
    const flask = document.getElementById('lab-flask');
    
    // RESET: Clear animations and hide feedback
    if (flask) flask.className = ""; 
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) feedbackContainer.classList.add('hide');

    if (questionDisplay) {
        questionDisplay.innerText = question.question;
    }
    
    const buttonContainer = document.getElementById('answer-buttons');
    if (buttonContainer) {
        buttonContainer.innerHTML = ''; 
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => selectAnswer(option, question.answer, question.explanation);
            buttonContainer.appendChild(button);
        });
    }

    startTimer();
}

/**
 * Logic for selecting an answer
 */
function selectAnswer(selected, correct, explanation) {
    clearInterval(timerInterval);
    const flask = document.getElementById('lab-flask');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (selected === correct) {
        score++;
        if (feedbackText) feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
        
        // Trigger Shake
        if (flask) {
            flask.className = ""; 
            void flask.offsetWidth; 
            flask.classList.add('shake');
        }
    } else {
        if (feedbackText) feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
        
        // Trigger Burn
        if (flask) {
            flask.className = ""; 
            void flask.offsetWidth; 
            flask.classList.add('burn');
        }
    }
    
    updateScoreDisplay();
    if (feedbackContainer) feedbackContainer.classList.remove('hide');

    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Updates the score display text
 */
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-count');
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

/**
 * Moves to the next question or ends the quiz
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px;">
                    <h1>Quiz Complete!</h1>
                    <p>Your final score is ${score} out of ${currentQuestions.length}.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; width: 100%;">Restart Quiz</button>
                </div>
            `;
        }
    }
}

// Initial script execution
loadQuiz();
