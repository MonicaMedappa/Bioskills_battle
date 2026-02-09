// script.js - Bioskills Battle Logic

let questionUrl = 'Set-1-questions.json'; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Timer Variables
let timeLeft = 20;
let timerInterval;

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
    timeLeft = 20; // Reset to 20 seconds
    document.getElementById("seconds").innerText = timeLeft;

    // Clear any existing timer to prevent overlapping loops
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("seconds").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    // Treat a timeout as a "wrong" answer (0 points)
    const question = currentQuestions[currentQuestionIndex];
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');

    feedbackText.innerHTML = `<strong>⏰ Time's up!</strong> You ran out of time. ${question.explanation}`;
    
    feedbackContainer.classList.remove('hide');

    // Disable buttons so user can't click after time is up
    const buttons = document.querySelectorAll('#answer-buttons button');
    buttons.forEach(btn => btn.disabled = true);
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = question.question;
    
    const buttonContainer = document.getElementById('answer-buttons');
    buttonContainer.innerHTML = ''; 

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => selectAnswer(option, question.answer, question.explanation);
        buttonContainer.appendChild(button);
    });

    // Start the countdown as soon as the question is displayed
    startTimer();
}

function selectAnswer(selected, correct, explanation) {
    // STOP the timer immediately once an answer is chosen
    clearInterval(timerInterval);

    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    
    // Check if the answer is correct AND time hasn't run out
    if (selected === correct && timeLeft > 0) {
        score++;
        feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
    } else {
        feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
    }
    
    updateScoreDisplay();
    feedbackContainer.classList.remove('hide');

    // Disable buttons to prevent multiple clicks
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
        document.getElementById('feedback-container').classList.add('hide');
        showQuestion();
    } else {
        // Final Results Screen
        document.getElementById('quiz-container').innerHTML = `
            <h1>Quiz Complete!</h1>
            <p>Your final score is ${score} out of ${currentQuestions.length}.</p>
            <p>Keep practicing your Bio-skills!</p>
            <button onclick="location.reload()" style="margin-top: 20px; text-align: center; width: 100%;">Restart Quiz</button>
        `;
    }
}

// Initial load
loadQuiz();
