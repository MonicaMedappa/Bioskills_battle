// script.js - Bioskills Battle Logic

let questionUrl = 'Set-1-questions.json'; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Timer Variables
let timeLeft = 20;
let timerInterval = null; // Initialize as null

/**
 * Switch the question set based on user selection
 */
async function switchSet(newUrl) {
    questionUrl = newUrl;
    currentQuestionIndex = 0;
    score = 0;
    
    updateScoreDisplay();
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) {
        feedbackContainer.classList.add('hide');
    }
    
    await loadQuiz();
}

async function loadQuiz() {
    try {
        const response = await fetch(questionUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        
        currentQuestions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Error loading the questions:", error);
        document.getElementById('question-text').innerText = "Failed to load questions.";
    }
}

/**
 * Timer Logic
 */
function startTimer() {
    clearInterval(timerInterval); // Stop any running timer first
    timeLeft = 20; 
    
    const secondsDisplay = document.getElementById("seconds");
    if (secondsDisplay) {
        secondsDisplay.innerText = timeLeft;
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (secondsDisplay) {
            secondsDisplay.innerText = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    const question = currentQuestions[currentQuestionIndex];
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');

    if (feedbackText) {
        feedbackText.innerHTML = `<strong>⏰ Time's up!</strong> You ran out of time. ${question.explanation}`;
    }
    
    if (feedbackContainer) {
        feedbackContainer.classList.remove('hide');
    }

    // Disable buttons
    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const questionDisplay = document.getElementById('question-text');
    
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

    // Explicitly call the timer
    startTimer();
}

function selectAnswer(selected, correct, explanation) {
    // STOP the timer immediately
    clearInterval(timerInterval);

    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (selected === correct && timeLeft > 0) {
        score++;
        if (feedbackText) feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
    } else {
        if (feedbackText) feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
    }
    
    updateScoreDisplay();
    if (feedbackContainer) feedbackContainer.classList.remove('hide');

    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-count');
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        const feedback = document.getElementById('feedback-container');
        if (feedback) feedback.classList.add('hide');
        showQuestion();
    } else {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <h1>Quiz Complete!</h1>
                <p>Your final score is ${score} out of ${currentQuestions.length}.</p>
                <p>Keep practicing your Bio-skills!</p>
                <button onclick="location.reload()" style="margin-top: 20px; text-align: center; width: 100%;">Restart Quiz</button>
            `;
        }
    }
}

// Start game
loadQuiz();
