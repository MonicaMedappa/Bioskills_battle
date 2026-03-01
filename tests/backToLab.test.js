import { jest } from '@jest/globals';

// We need to mock the modules that app.js imports
jest.unstable_mockModule('../src/quizUI.js', () => ({
    QuizUI: {
        showLandingPage: jest.fn(),
        showLabBenchPage: jest.fn(),
        getChooseHubButton: jest.fn(() => ({ onclick: null })),
        getLabBenchButton: jest.fn(() => ({ onclick: null })),
        getLibraryButton: jest.fn(() => ({ onclick: null })),
        getCloseModalButton: jest.fn(() => ({ onclick: null })),
        getBackToHomeFromLab: jest.fn(() => ({ onclick: null })),
        getBackToHomeFromLibrary: jest.fn(() => ({ onclick: null })),
        getBackToLibraryButton: jest.fn(() => ({ onclick: null })),
        getSetTiles: jest.fn(() => []),
        getNextButton: jest.fn(() => ({ onclick: null })),
        getQuizBackButton: jest.fn(() => ({ onclick: null })),
        // This is the missing getter we are testing for
        getBackToLabButton: jest.fn(),
        showBattleHubModal: jest.fn(),
    }
}));

jest.unstable_mockModule('../src/quizModel.js', () => ({
    QuizModel: {
        resetState: jest.fn(),
        loadQuizData: jest.fn(),
        getScore: jest.fn(() => 0),
    }
}));

jest.unstable_mockModule('../src/utils.js', () => ({
    browserUtils: {
        reloadPage: jest.fn(),
    }
}));

jest.unstable_mockModule('../src/data.js', () => ({
    labTechniques: [],
    libraryArticles: [],
    articleSets: {}
}));

describe('Back to Lab Bench Button', () => {
    let app;
    let QuizUI;

    beforeEach(async () => {
        jest.clearAllMocks();
        ({ QuizUI } = await import('../src/quizUI.js'));
        const appModule = await import('../src/app.js');
        app = appModule.default;
    });

    test('init should wire up the back-to-lab-btn to showLabBenchPage', async () => {
        const mockBackBtn = { onclick: null };
        QuizUI.getBackToLabButton.mockReturnValue(mockBackBtn);

        await app.init();

        expect(QuizUI.getBackToLabButton).toHaveBeenCalled();
        expect(mockBackBtn.onclick).toBeDefined();

        // Simulate click
        mockBackBtn.onclick();
        expect(QuizUI.showLabBenchPage).toHaveBeenCalled();
    });
});
