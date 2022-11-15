import mockLogger from '../stubs/Logger';
import mockEventBus from '../stubs/EventBus';
import Whatsapp from '../../src/Libs/Whatsapp';
import {Client} from 'whatsapp-web.js';

// mock resolve a promise
const mockInitialize = jest.fn().mockResolvedValue(true);
const mockOn = jest.fn();
const mockDestroy = jest.fn();

const mockMessage = {
    mediaKey: 'mediaKey',
    id: {
        fromMe: false,
        remote: `554199999999@c.us`,
        id: '1234567890ABCDEFGHIJ',
        _serialized: `false_554199999999@c.us_1234567890ABCDEFGHIJ`
    },
    ack: -1,
    hasMedia: false,
    body: 'Hello!',
    timestamp: 1591482682,
    from: `554199999999@c.us`,
    to: `554188888888@c.us`,
    author: 'AUTHOR',
    isForwarded: false,
    broadcast: false,
    fromMe: false,
    hasQuotedMsg: false,
    mentionedIds: [
        'ID'
    ]
}

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


jest.mock('qrcode-terminal');

beforeEach(() => {
    mockInitialize.mockClear();
    mockDestroy.mockClear();
    mockOn.mockClear();
    mockDestroy.mockClear();

    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
    mockLogger.debug.mockClear();
    mockLogger.warn.mockClear();

    mockEventBus.dispatch.mockClear();
    mockEventBus.register.mockClear();
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

    it('onReady', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onReady = mockOn.mock.calls[1][1];
        onReady();

        expect(mockLogger.info).toHaveBeenCalledWith('Client is ready!');
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.ready');
    })

    it('onAuthenticated', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onAuthenticated = mockOn.mock.calls[3][1];
        onAuthenticated();

        expect(mockLogger.info).toHaveBeenCalledWith('Client is authenticated');
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.authenticated');
    })

    it('onLoadingScreen', async () => { 
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onLoadingScreen = mockOn.mock.calls[2][1];
        onLoadingScreen();

        expect(mockLogger.info).toHaveBeenCalledWith('Client is loading screen');
    })

    it('onQr', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onQr = mockOn.mock.calls[0][1];
        onQr('qr');

        expect(mockLogger.info).toHaveBeenCalledWith('QR Code Received', 'qr');
    })

    it('onDisconnected', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onDisconnected = mockOn.mock.calls[4][1];
        onDisconnected();

        expect(mockLogger.info).toHaveBeenCalledWith('Client is disconnected');
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.disconnected');
    })

    it('onMessage', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onMessage = mockOn.mock.calls[5][1];
        

        onMessage(mockMessage);
        expect(mockLogger.info).toHaveBeenCalledWith('Message received', mockMessage);
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message', mockMessage);
    })

    it('onMessageCreate', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onMessageCreate = mockOn.mock.calls[6][1];

        onMessageCreate(mockMessage);
        expect(mockLogger.info).toHaveBeenCalledWith('Message created', mockMessage);
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.create', mockMessage);
    })

    it('onMessageAck', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();
        const onMessageAck = mockOn.mock.calls[7][1];

        onMessageAck(mockMessage, 1);
        expect(mockLogger.info).toHaveBeenCalledWith('Message ack', mockMessage.id, 1);
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.ack', {
            message: mockMessage,
            ack: 1
        });
    })

    it('onMessageRevokeForEveryone', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onMessageRevokeForEveryone = mockOn.mock.calls[8][1];

        onMessageRevokeForEveryone(mockMessage, mockMessage);
        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for everyone', mockMessage.id, mockMessage.id);
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_everyone', {
            message: mockMessage,
            revokedMessage: mockMessage
        });
    })

    it('onMessageRevokeForMe', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onMessageRevokeForMe = mockOn.mock.calls[9][1];

        onMessageRevokeForMe(mockMessage);
        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for me', mockMessage.id);

        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_me', mockMessage);
    })

    it('onChangeState', async () => {
        const whatsapp = new Whatsapp();
        await whatsapp.start();

        const onChangeState = mockOn.mock.calls[10][1];

        onChangeState('state');
        expect(mockLogger.info).toHaveBeenCalledWith('State changed', 'state');
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.state', 'state');
    })

    

    it('start client with error', async () => {
        const error = new Error('error');
        mockInitialize.mockRejectedValue(error);
        //should throw error
        await expect(new Whatsapp().start()).rejects.toThrow(error);
        expect(mockLogger.error).toHaveBeenCalledWith('Client fatal error');
    })
})
