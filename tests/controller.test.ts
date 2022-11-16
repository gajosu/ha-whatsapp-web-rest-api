import Controller from '../src/Libs/Controller';

const mockLogger = {
    getCategoryLogger: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
}

const mockWhatsapp = {
    start: jest.fn(),
    stop: jest.fn(),
    getClient: jest.fn()
}

const mockWebServer = {
    start: jest.fn(),
    stop: jest.fn()
}

const mockWebSocket = {
    start: jest.fn(),
    stop: jest.fn()
}

describe('controller', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('start services', () => {
        const controller = new Controller(mockLogger, mockWhatsapp, mockWebServer, mockWebSocket);
        controller.start();

        expect(mockLogger.info).toBeCalledWith('Starting Controller');
        expect(mockWhatsapp.start).toBeCalledTimes(1);
        expect(mockWebServer.start).toBeCalledTimes(1);
        expect(mockWebSocket.start).toBeCalledTimes(1);
    });
});