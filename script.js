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

/**
 * Fetch questions from the JSON file
 */
async function loadQuiz() {
    try {
        const response = await fetch(questionUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        
        currentQuestions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Error loading the questions:", error);
        const questionDisplay = document.getElementById('question-text');
        if (questionDisplay) {
            questionDisplay.innerText = "Failed to load questions. Please check your JSON file.";
        }
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
        
        if (secondsDisplay) {
            secondsDisplay.innerText = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

/**
 * Handle scenario where time runs out
 */
function handleTimeout() {
    const question = currentQuestions[currentQuestionIndex];
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const flask = document.getElementById('lab-flask');

    // Break the flask because time ran out
    if (flask) {
        flask.classList.add('break');
    }

    if (feedbackText) {
        feedbackText.innerHTML = `<strong>⏰ Time's up!</strong> ${question.explanation}`;
    }
    
    if (feedbackContainer) {
        feedbackContainer.classList.remove('hide');
    }

    // Disable buttons so user can't answer after time is up
    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Display the current question and reset UI elements
 */
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const questionDisplay = document.getElementById('question-text');
    const flask = document.getElementById('lab-flask');
    
    // 1. Reset the flask visual state for the new question
    if (flask) {
        flask.classList.remove('shake', 'break');
    }

    // 2. Hide feedback from previous question
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) {
        feedbackContainer.classList.add('hide');
    }

    if (questionDisplay) {
        questionDisplay.innerText = question.question;
    }
    
    // 3. Render answer buttons
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

    // 4. Start the countdown
    startTimer();
}

/**
 * Handle user answer selection
 */
function selectAnswer(selected, correct, explanation) {
    clearInterval(timerInterval);

    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    const flask = document.getElementById('lab-flask');
    
    if (selected === correct && timeLeft > 0) {
        score++;
        if (feedbackText) feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
        
        // Shake the flask (it stays intact)
        if (flask) {
            flask.classList.remove('shake'); // Reset if it was already shaking
            void flask.offsetWidth; // Trigger reflow to restart animation
            flask.classList.add('shake');
        }
        
    } else {
        if (feedbackText) feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
        
        // Break the flask
        if (flask) flask.classList.add('break');
    }
    
    updateScoreDisplay();
    if (feedbackContainer) feedbackContainer.classList.remove('hide');

    // Disable buttons
    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Update the UI score counter
 */
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-count');
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }
}

/**
 * Advance to the next question or show the final result
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div class="quiz-end">
                    <h1>Quiz Complete!</h1>
                    <p>Your final score is <strong>${score}</strong> out of ${currentQuestions.length}.</p>
                    <p>Keep practicing your Bio-skills!</p>
                    <button onclick="location.reload()" class="restart-btn">Restart Quiz</button>
                </div>
            `;
        }
    }
}

// Attach event listener for the "Next" button in the feedback container
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.onclick = nextQuestion;
    }
    
    // Initial load
    loadQuiz();
});
