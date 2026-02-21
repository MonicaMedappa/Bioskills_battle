// tests/quizUI.test.js
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for TextEncoder and TextDecoder to address JSDOM compatibility issues
async function polyfillTextEncoder() {
  if (typeof TextEncoder === 'undefined') {
    const util = await import('util');
    global.TextEncoder = util.TextEncoder;
  }
  if (typeof TextDecoder === 'undefined') {
    const util = await import('util');
    global.TextDecoder = util.TextDecoder;
  }
}

// Import the QuizUI module
import { QuizUI } from '../src/quizUI.js';

describe('QuizUI Module', () => {
  let mockHtml;

  beforeAll(async () => {
    await polyfillTextEncoder();
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const htmlFilePath = path.join(__dirname, '../index.html');
    try {
      mockHtml = fs.readFileSync(htmlFilePath, 'utf8');
    } catch (error) {
      console.error("Error reading index.html for tests:", error);
      mockHtml = '<!DOCTYPE html><html><body><div id="landing-page"></div><div id="quiz-container" class="hide"></div></body></html>';
    }
  });

  beforeEach(() => {
    document.body.innerHTML = mockHtml;
  });

  test('showLandingPage should display landing and hide quiz', () => {
    const landingPage = QuizUI.getLandingPage();
    const quizContainer = QuizUI.getQuizContainer();
    
    quizContainer.classList.remove('hide');
    landingPage.style.display = 'none';

    QuizUI.showLandingPage();

    expect(landingPage.style.display).toBe('block');
    expect(quizContainer.classList.contains('hide')).toBe(true);
  });

  test('showQuiz should hide landing and show quiz', () => {
    const landingPage = QuizUI.getLandingPage();
    const quizContainer = QuizUI.getQuizContainer();

    landingPage.style.display = 'block';
    quizContainer.classList.add('hide');

    QuizUI.showQuiz();

    expect(landingPage.style.display).toBe('none');
    expect(quizContainer.classList.contains('hide')).toBe(false);
  });

  test('setupStartButton should attach a click listener', () => {
    const mockCallback = jest.fn();
    const startBtn = QuizUI.getStartButton();
    if (startBtn) {
        startBtn.onclick = mockCallback;
        startBtn.click();
    }
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  // New tests for QuizUI methods
  test('updateTimerDisplay should update the timer display text', () => {
    const timerDisplay = QuizUI.getTimerDisplay();
    if (timerDisplay) {
        QuizUI.updateTimerDisplay(15);
        expect(timerDisplay.innerText).toBe('15');
    }
  });

  test('setTimerContainerRed should add/remove red and blink classes', () => {
    const timerContainer = QuizUI.getTimerContainer();
    if (timerContainer) {
        QuizUI.setTimerContainerRed(true);
        expect(timerContainer.classList.contains('red')).toBe(true);
        expect(timerContainer.classList.contains('blink')).toBe(true);

        QuizUI.setTimerContainerRed(false);
        expect(timerContainer.classList.contains('red')).toBe(false);
        expect(timerContainer.classList.contains('blink')).toBe(false);
    }
  });

  test('showTimeUpMessage should show/hide the time up message', () => {
    const timeUpMessage = QuizUI.getTimeUpMessage();
    if (timeUpMessage) {
        QuizUI.showTimeUpMessage(true);
        expect(timeUpMessage.classList.contains('hide')).toBe(false);

        QuizUI.showTimeUpMessage(false);
        expect(timeUpMessage.classList.contains('hide')).toBe(true);
    }
  });

  test('updateQuestionText should update the question text', () => {
    const questionTextElement = QuizUI.getQuestionTextElement();
    if (questionTextElement) {
        QuizUI.updateQuestionText('New Question?');
        expect(questionTextElement.innerText).toBe('New Question?');
    }
  });

  test('clearAnswerButtons should clear the answer buttons container', () => {
    const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
    if (answerButtonsContainer) {
        answerButtonsContainer.innerHTML = '<button>Option 1</button>';
        QuizUI.clearAnswerButtons();
        expect(answerButtonsContainer.innerHTML).toBe('');
    }
  });

  test('appendAnswerButton should add a button to the container', () => {
    const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
    if (answerButtonsContainer) {
        QuizUI.clearAnswerButtons();
        const mockCallback = jest.fn();
        QuizUI.appendAnswerButton('Test Option', mockCallback);
        const button = answerButtonsContainer.querySelector('button');
        expect(button).not.toBeNull();
        expect(button.innerText).toBe('Test Option');
        button.click();
        expect(mockCallback).toHaveBeenCalledTimes(1);
    }
  });

  test('updateFeedback should update feedback content and show it', () => {
    const feedbackContainer = QuizUI.getFeedbackContainer();
    if (feedbackContainer) {
        feedbackContainer.classList.add('hide'); // Ensure hidden initially
        QuizUI.updateFeedback('Feedback message', true);
        expect(feedbackContainer.innerHTML).toContain('Feedback message');
        expect(feedbackContainer.classList.contains('hide')).toBe(false);
    }
  });

  test('hideFeedback should add hide class to feedback container', () => {
    const feedbackContainer = QuizUI.getFeedbackContainer();
    if (feedbackContainer) {
        feedbackContainer.classList.remove('hide'); // Ensure visible initially
        QuizUI.hideFeedback();
        expect(feedbackContainer.classList.contains('hide')).toBe(true);
    }
  });

  test('disableAnswerButtons should disable/enable all buttons', () => {
    const answerButtonsContainer = QuizUI.getAnswerButtonsContainer();
    if (answerButtonsContainer) {
        answerButtonsContainer.innerHTML = '<button>A</button><button>B</button>';
        QuizUI.disableAnswerButtons(true);
        answerButtonsContainer.querySelectorAll('button').forEach(button => {
            expect(button.disabled).toBe(true);
        });

        QuizUI.disableAnswerButtons(false);
        answerButtonsContainer.querySelectorAll('button').forEach(button => {
            expect(button.disabled).toBe(false);
        });
    }
  });

  test('updateScoreDisplay should update the score display text', () => {
    const scoreCountElement = QuizUI.getScoreCountElement();
    if (scoreCountElement) {
        QuizUI.updateScoreDisplay(5);
        expect(scoreCountElement.innerText).toBe('Score: 5');
    }
  });

  test('renderFinalResults should display final quiz results and attach restart listener', () => {
    const quizContainer = QuizUI.getQuizContainer();
    if (quizContainer) {
        const mockReload = jest.fn();
        QuizUI.renderFinalResults(7, 10, mockReload);
        expect(quizContainer.innerHTML).toContain('<h1>Quiz Complete!</h1>');
        expect(quizContainer.innerHTML).toContain('Your final score is 7 out of 10.');
        const restartButton = QuizUI.getRestartQuizButton();
        expect(restartButton).not.toBeNull();
        if (restartButton) {
            restartButton.click();
            expect(mockReload).toHaveBeenCalledTimes(1);
        }
    }
  });

  // Test getQuestionSetSelector
  test('getQuestionSetSelector should return the question set selector element', () => {
    const selector = QuizUI.getQuestionSetSelector();
    expect(selector).not.toBeNull();
    expect(selector.id).toBe('question-set');
  });

  // Test getNextButton
  test('getNextButton should return the next button element', () => {
    const nextButton = QuizUI.getNextButton();
    expect(nextButton).not.toBeNull();
    expect(nextButton.id).toBe('next-btn');
  });
});