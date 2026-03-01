// tests/quizModel.test.js
import { jest } from '@jest/globals';
import { QuizModel } from '../src/quizModel.js';

describe('QuizModel Module', () => {
    beforeEach(() => {
        QuizModel.resetState();
        QuizModel.currentQuestions = [];
        QuizModel.questionUrl = 'Set-1-questions.json';
        global.fetch = jest.fn();
    });

    test('resetState should reset index and score', () => {
        QuizModel.currentQuestionIndex = 5;
        QuizModel.score = 3;
        QuizModel.resetState();
        expect(QuizModel.currentQuestionIndex).toBe(0);
        expect(QuizModel.score).toBe(0);
    });

    test('loadQuizData should populate questions on success', async () => {
        const mockQuestions = [
            { question: 'Q1', options: ['A', 'B'], answer: 'A', explanation: 'E1' },
            { question: 'Q2', options: ['C', 'D'], answer: 'C', explanation: 'E2' }
        ];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockQuestions
        });

        const result = await QuizModel.loadQuizData('mock-url.json');
        expect(result).toBe(true);
        expect(QuizModel.currentQuestions).toEqual(mockQuestions);
        expect(QuizModel.questionUrl).toBe('mock-url.json');
    });

    test('loadQuizData should return false on network error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        const result = await QuizModel.loadQuizData('error.json');
        expect(result).toBe(false);
        expect(QuizModel.currentQuestions).toEqual([]);
    });

    test('loadQuizData should return false on invalid data format', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ not: 'an array' })
        });
        const result = await QuizModel.loadQuizData('invalid.json');
        expect(result).toBe(false);
        expect(QuizModel.currentQuestions).toEqual([]);
    });

    test('getNextQuestion should return next question or null at the end', () => {
        QuizModel.currentQuestions = [{ q: '1' }, { q: '2' }];
        QuizModel.currentQuestionIndex = 0;

        const next = QuizModel.getNextQuestion();
        expect(next.q).toBe('2');
        expect(QuizModel.currentQuestionIndex).toBe(1);

        const end = QuizModel.getNextQuestion();
        expect(end).toBeNull();
    });

    test('checkAnswer should increment score correctly', () => {
        QuizModel.currentQuestions = [{ question: 'Q1', answer: 'A' }];
        QuizModel.currentQuestionIndex = 0;
        QuizModel.score = 0;

        const result1 = QuizModel.checkAnswer('B');
        expect(result1).toBe(false);
        expect(QuizModel.score).toBe(0);

        const result2 = QuizModel.checkAnswer('A');
        expect(result2).toBe(true);
        expect(QuizModel.score).toBe(1);
    });

    test('getQuestionExplanation and getQuestionOptions should return correct data', () => {
        QuizModel.currentQuestions = [{ question: 'Q1', options: ['A', 'B'], answer: 'A', explanation: 'Expl' }];
        QuizModel.currentQuestionIndex = 0;

        expect(QuizModel.getQuestionExplanation()).toBe('Expl');
        expect(QuizModel.getQuestionOptions()).toEqual(['A', 'B']);
    });
});
