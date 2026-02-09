let questionUrl = 'Set-1-questions.json'; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 20;
let timerInterval = null;

async function loadQuiz() {
    try {
        const response = await fetch(questionUrl);
        currentQuestions = await response.json();
        showQuestion();
    } catch (error) {
        document.getElementById('question-text').innerText = "Failed to load questions.";
    }
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const flask = document.getElementById('lab-flask');
    
    // 1. Reset Flask: Remove animations so they can trigger again
    if (flask) {
        flask.classList.remove('shake', 'burn');
        void flask.offsetWidth; // This "tricks" the browser into restarting animations
    }

    // 2. Hide Feedback
    document.getElementById('feedback-container').classList.add('hide');
    
    // 3. Set Question Text
    document.getElementById('question-text').innerText = question.question;
    
    // 4. Generate Buttons
    const buttonContainer = document.getElementById('answer-buttons');
    buttonContainer.innerHTML = ''; 
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => selectAnswer(option, question.answer, question.explanation);
        buttonContainer.appendChild(button);
    });

    startTimer();
}

function selectAnswer(selected, correct, explanation) {
    clearInterval(timerInterval);
    const flask = document.getElementById('lab-flask');
    const feedbackText = document.getElementById('feedback-text');
    
    if (selected === correct) {
        score++;
        feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
        if (flask) flask.classList.add('shake');
    } else {
        feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
        if (flask) flask.classList.add('burn');
    }
    
    document.getElementById('score-count').innerText = `Score: ${score}`;
    document.getElementById('feedback-container').classList.remove('hide');
    
    // Disable all buttons so user can't click twice
    document.querySelectorAll('#answer-buttons button').forEach(btn => btn.disabled = true);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    document.getElementById("seconds").innerText = timeLeft;

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
    const flask = document.getElementById('lab-flask');
    const question = currentQuestions[currentQuestionIndex];
    if (flask) flask.classList.add('burn');
    
    document.getElementById('feedback-text').innerHTML = `<strong>⏰ Time's up!</strong> ${question.explanation}`;
    document.getElementById('feedback-container').classList.remove('hide');
    document.querySelectorAll('#answer-buttons button').forEach(btn => btn.disabled = true);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').innerHTML = `
            <h1>Quiz Complete!</h1>
            <p>Final Score: ${score} / ${currentQuestions.length}</p>
            <button onclick="location.reload()">Restart</button>
        `;
    }
}

loadQuiz();
