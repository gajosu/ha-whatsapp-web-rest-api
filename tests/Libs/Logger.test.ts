import Logger from "../../src/Libs/Logger";

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

jest.mock('../../src/config/Winston', () => {
    return {
        getLogger: () => {
            return mockLogger;
        }
    };
});


beforeEach(() => {
    jest.clearAllMocks();
});

describe('Logger tests', () => {
    it('logging tests', async () => {
        const logger = new Logger();
        logger.info('test', 'arg');
        logger.error('test');
        logger.warn('test');
        logger.debug('test');

        expect(mockLogger.info).toHaveBeenCalledWith('test', ['arg']);
        expect(mockLogger.error).toHaveBeenCalledWith('test', []);
        expect(mockLogger.warn).toHaveBeenCalledWith('test', []);
        expect(mockLogger.debug).toHaveBeenCalledWith('test', []);
    });
});