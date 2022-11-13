const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}

jest.mock('../../src/Libs/Logger', () => {
    return  jest.fn().mockImplementation(() => {
            return mockLogger;
        });
});

export default mockLogger