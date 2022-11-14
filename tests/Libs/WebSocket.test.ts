import mockLogger from '../stubs/Logger';
import mockEventBus from '../stubs/EventBus';
import WebSocket from '../../src/Libs/WebSocket';


const mockOn = jest.fn();
// mock client
jest.mock('socket.io', () => {
    return {
        Server: jest.fn().mockImplementation(() => {
            return {
                on: mockOn
            };
        })
    };
});

jest.mock('http');

beforeEach(() => {
    mockOn.mockClear();
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
    mockLogger.debug.mockClear();
    mockLogger.warn.mockClear();

    mockEventBus.dispatch.mockClear();
    mockEventBus.register.mockClear();
});

describe('WebSocket tests', () => {
    it('start socket', async () => {
        const http = require('http');
        const websocket = new WebSocket(http);
        websocket.start();

        expect(mockLogger.info).toHaveBeenCalledWith('Starting WebSocket');
        expect(mockOn).toHaveBeenCalledWith('connection', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('On connection', async () => {
        const http = require('http');
        const websocket = new WebSocket(http);
        websocket.start();

        const mockSocket = {
            id: '123',
            emit: jest.fn()
        };

        const onConnection = mockOn.mock.calls[0][1];
        onConnection(mockSocket);

        expect(mockLogger.info).toHaveBeenCalledWith('New connection from 123');
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('socket.connection', mockSocket);

        //mock eventbus whatsapp.qr event
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.qr', expect.any(Function));

        const mockQr = 'mockQr';
        const onQr = mockEventBus.register.mock.calls[0][1];
        onQr(mockQr);
        expect(mockSocket.emit).toHaveBeenCalledWith('qr_code', { data: mockQr });
    });

    it('On disconnect', async () => {
        const http = require('http');
        const websocket = new WebSocket(http);
        websocket.start();

        const mockSocket = {
            id: '123',
            emit: jest.fn()
        };

        const onDisconnect = mockOn.mock.calls[1][1];
        onDisconnect(mockSocket);

        expect(mockLogger.info).toHaveBeenCalledWith('Disconnect from 123');
    });

});
