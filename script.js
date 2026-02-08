const questionUrl = 'Set-2-questions.json'; 

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0; // Tracks the number of correct answers

async function loadQuiz() {
    try {
        const response = await fetch(questionUrl);
        currentQuestions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Error loading the questions:", error);
        document.getElementById('question-text').innerText = "Failed to load questions.";
    }
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
}

function selectAnswer(selected, correct, explanation) {
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
            <p>You've mastered SDS-PAGE fundamentals!</p>
            <button onclick="location.reload()" style="margin-top: 20px;">Restart Quiz</button>
        `;
    }
}

loadQuiz();
