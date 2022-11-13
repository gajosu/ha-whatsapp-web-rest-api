import Whatsapp from '../../src/Libs/Whatsapp';
import {Client} from 'whatsapp-web.js';
import mockLogger from '../stubs/Logger';

// mock resolve a promise
const mockInitialize = jest.fn().mockResolvedValue(true);
const mockOn = jest.fn();
const mockDestroy = jest.fn();

jest.mock('../../src/Libs/Logger', () => {
    return  jest.fn().mockImplementation(() => {
            return mockLogger;
        });
});

// mock client
jest.mock('whatsapp-web.js', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                initialize: mockInitialize,
                on: mockOn,
                destroy: mockDestroy
            };
        }),
        LocalAuth: jest.fn()
    };
});


beforeEach(() => {
    mockDestroy.mockClear();
    mockOn.mockClear();
    mockDestroy.mockClear();
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
    mockLogger.debug.mockClear();
    mockLogger.warn.mockClear();
});

describe('Whatsapp tests', () => {
    it('start client', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        expect(Client).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Starting Client');
        expect(mockLogger.info).toHaveBeenCalledWith('Client initialized');
        
        expect(mockInitialize).toHaveBeenCalledTimes(1);
        expect(mockOn).toHaveBeenCalledWith('qr', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('authenticated', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('disconnected', expect.any(Function));
    })

    it('start client with error', async () => {
        const error = new Error('error');
        mockInitialize.mockRejectedValue(error);
        //should throw error
        await expect(new Whatsapp().start()).rejects.toThrow(error);
        expect(mockLogger.error).toHaveBeenCalledWith('Client fatal error');
    })
})
