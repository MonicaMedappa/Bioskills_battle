// script.js - Bioskills Battle Logic

let questionUrl = 'Set-1-questions.json'; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Timer Variables
let timeLeft = 20;
let timerInterval = null;

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
        const questionText = document.getElementById('question-text');
        if (questionText) questionText.innerText = "Failed to load questions.";
    }
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

function handleTimeout() {
    const question = currentQuestions[currentQuestionIndex];
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const flask = document.getElementById('lab-flask');

    // Trigger "burn" animation for running out of time
    if (flask) flask.classList.add('burn');

    if (feedbackText) {
        feedbackText.innerHTML = `<strong>⏰ Time's up!</strong> ${question.explanation}`;
    }
    
    if (feedbackContainer) feedbackContainer.classList.remove('hide');

    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const questionDisplay = document.getElementById('question-text');
    const flask = document.getElementById('lab-flask');
    
    // RESET: Remove all animation classes for the new question
    if (flask) {
        flask.classList.remove('shake', 'break', 'burn');
    }

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

function selectAnswer(selected, correct, explanation) {
    clearInterval(timerInterval);

    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const flask = document.getElementById('lab-flask');
    
    if (selected === correct && timeLeft > 0) {
        score++;
        if (feedbackText) feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
        if (flask) flask.classList.add('shake'); // Shake for correct
        
    } else {
        if (feedbackText) feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
        if (flask) flask.classList.add('burn'); // Burn for wrong
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
        // Keeps the layout clean by only updating the inner content
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <h1>Quiz Complete!</h1>
                    <p>Your final score is ${score} out of ${currentQuestions.length}.</p>
                    <button onclick="location.reload()" class="next-btn" style="width:100%">Restart Quiz</button>
                </div>
            `;
        }
    }
}

loadQuiz();
