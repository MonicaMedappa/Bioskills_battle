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

  test('showLandingPage should display landing and hide other pages', () => {
    QuizUI.showLandingPage();
    expect(QuizUI.getLandingPage().classList.contains('hide')).toBe(false);
    expect(QuizUI.getQuizContainer().classList.contains('hide')).toBe(true);
    expect(QuizUI.getSdsPage().classList.contains('hide')).toBe(true);
    expect(QuizUI.getLabBenchPage().classList.contains('hide')).toBe(true);
    expect(QuizUI.getLibraryPage().classList.contains('hide')).toBe(true);
  });

  test('showQuiz should hide other pages and show quiz', () => {
    QuizUI.showQuiz();
    expect(QuizUI.getLandingPage().classList.contains('hide')).toBe(true);
    expect(QuizUI.getQuizContainer().classList.contains('hide')).toBe(false);
  });

  test('showLabBenchPage should hide other pages and show lab bench', () => {
    QuizUI.showLabBenchPage();
    expect(QuizUI.getLandingPage().classList.contains('hide')).toBe(true);
    expect(QuizUI.getLabBenchPage().classList.contains('hide')).toBe(false);
  });

  test('showLibraryPage should hide other pages and show library', () => {
    QuizUI.showLibraryPage();
    expect(QuizUI.getLandingPage().classList.contains('hide')).toBe(true);
    expect(QuizUI.getLibraryPage().classList.contains('hide')).toBe(false);
  });

  test('showBattleHubModal should toggle modal visibility', () => {
    QuizUI.showBattleHubModal(true);
    expect(QuizUI.getBattleHubModal().classList.contains('hide')).toBe(false);
    QuizUI.showBattleHubModal(false);
    expect(QuizUI.getBattleHubModal().classList.contains('hide')).toBe(true);
  });

  test('getChooseHubButton should return the correct element', () => {
    const btn = QuizUI.getChooseHubButton();
    expect(btn).not.toBeNull();
    expect(btn.id).toBe('choose-hub-btn');
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

  test('getBattleHubModal should return the correct element', () => {
    const modal = QuizUI.getBattleHubModal();
    expect(modal).not.toBeNull();
    expect(modal.id).toBe('battle-hub-modal');
  });

  test('getLabBenchButton should return the correct element', () => {
    const btn = QuizUI.getLabBenchButton();
    expect(btn).not.toBeNull();
    expect(btn.id).toBe('lab-bench-btn');
  });

  test('getLibraryButton should return the correct element', () => {
    const btn = QuizUI.getLibraryButton();
    expect(btn).not.toBeNull();
    expect(btn.id).toBe('library-btn');
  });

  test('getBackToHomeFromLab should return the correct element', () => {
    const btn = QuizUI.getBackToHomeFromLab();
    expect(btn).not.toBeNull();
    expect(btn.id).toBe('back-to-home-from-lab');
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

  // Test getNextButton
  test('getNextButton should return the next button element', () => {
    const nextButton = QuizUI.getNextButton();
    expect(nextButton).not.toBeNull();
    expect(nextButton.id).toBe('next-btn');
  });
});