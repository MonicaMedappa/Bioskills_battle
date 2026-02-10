// Change 'const' to 'let' so we can update the URL dynamically
let questionUrl = 'Set-1-questions.json'; 

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0; // Tracks the number of correct answers

// Timer Variables
const TIME_PER_QUESTION = 20; // 20 seconds per question
let timeLeft = TIME_PER_QUESTION;
let timerInterval;
let timerDisplay = document.getElementById('timer-display');
let timeUpMessage = document.getElementById('time-up-message');
let timerContainer = document.getElementById('timer-container');

/**
 * Switch the question set based on user selection
 * @param {string} newUrl - The filename of the JSON set (e.g., 'Set-2-questions.json')
 */
async function switchSet(newUrl) {
    questionUrl = newUrl;
    currentQuestionIndex = 0; // Reset progress
    score = 0;                // Reset score
    
    // Update UI for reset
    updateScoreDisplay();
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) {
        feedbackContainer.classList.add('hide');
    }
    
    // Reload the data and display the first question
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

function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    clearInterval(timerInterval); // Clear any existing timer
    timerDisplay.innerText = timeLeft;
    timerContainer.classList.remove('red', 'blink');
    timeUpMessage.classList.add('hide');

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 10) {
            timerContainer.classList.add('red');
            timerContainer.classList.add('blink');
        } else {
            timerContainer.classList.remove('red', 'blink');
        }

        if (timeLeft <= 0) {
            stopTimer();
            timeUpMessage.classList.remove('hide');
            // Automatically advance to the next question when time runs out
            nextQuestion(); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerContainer.classList.remove('red', 'blink');
    timeUpMessage.classList.add('hide');
}

function showQuestion() {
    startTimer(); // Start the timer for the new question
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
}

function selectAnswer(selected, correct, explanation) {
    stopTimer(); // Stop the timer when an answer is selected
    const feedbackText = document.getElementById('feedback-text');
    const feedbackContainer = document.getElementById('feedback-container');
    
    // Check if the answer is correct and update score
    if (selected === correct) {
        score++;
        feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
    } else {
        feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
    }
    
    updateScoreDisplay();
    feedbackContainer.classList.remove('hide');

    // Disable all buttons after an answer is selected to prevent double-scoring
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
            <button onclick="location.reload()" style="margin-top: 20px;">Restart Quiz</button>
        `;
    }
}

// Initial load
loadQuiz();
