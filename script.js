const questionUrl = 'Set-1-questions.json'; 

let currentQuestions = [];
let currentQuestionIndex = 0;

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
    
    if (selected === correct) {
        feedbackText.innerHTML = `<strong>Correct!</strong> ${explanation}`;
    } else {
        feedbackText.innerHTML = `<strong>Not quite.</strong> ${explanation}`;
    }
    feedbackContainer.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        document.getElementById('feedback-container').classList.add('hide');
        showQuestion();
    } else {
        document.getElementById('quiz-container').innerHTML = `
            <h1>Quiz Complete!</h1>
            <p>You have mastered the SDS-PAGE fundamentals.</p>
            <button onclick="location.reload()">Restart Quiz</button>
        `;
    }
}

loadQuiz();
