
import mockLogger from '../stubs/Logger'
import mockEventBus from '../stubs/EventBus'

import Whatsapp from '../../src/Libs/Whatsapp'
import { Client } from 'whatsapp-web.js'

// mock resolve a promise
const mockInitialize = jest.fn().mockResolvedValue(true)
const mockOn = jest.fn()
const mockDestroy = jest.fn()

const mockMessage = {
    mediaKey: 'mediaKey',
    id: {
        fromMe: false,
        remote: '554199999999@c.us',
        id: '1234567890ABCDEFGHIJ',
        _serialized: 'false_554199999999@c.us_1234567890ABCDEFGHIJ'
    },
    ack: -1,
    hasMedia: false,
    body: 'Hello!',
    timestamp: 1591482682,
    from: '554199999999@c.us',
    to: '554188888888@c.us',
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
            }
        }),
        LocalAuth: jest.fn()
    }
})

jest.mock('qrcode-terminal')

beforeEach(() => {
    jest.clearAllMocks()
})

describe('Whatsapp tests', () => {
    it('start client', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        expect(Client).toHaveBeenCalledTimes(1)
        expect(mockLogger.info).toHaveBeenCalledWith('Starting Client')
        expect(mockLogger.info).toHaveBeenCalledWith('Client initialized')

        expect(mockInitialize).toHaveBeenCalledTimes(1)
        expect(mockOn).toHaveBeenCalledWith('qr', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('ready', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('authenticated', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('disconnected', expect.any(Function))
    })

    it('onReady', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onReady = mockOn.mock.calls[1][1]
        onReady()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is ready!')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.ready')
    })

    it('onAuthenticated', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onAuthenticated = mockOn.mock.calls[3][1]
        onAuthenticated()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is authenticated')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.authenticated')
    })

    it('onLoadingScreen', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onLoadingScreen = mockOn.mock.calls[2][1]
        onLoadingScreen()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is loading screen')
    })

    it('onQr', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onQr = mockOn.mock.calls[0][1]
        onQr('qr')

        expect(mockLogger.info).toHaveBeenCalledWith('QR Code Received', 'qr')
    })

    it('onDisconnected', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onDisconnected = mockOn.mock.calls[4][1]
        await onDisconnected()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is disconnected')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.disconnected')
    })

    it('onMessage', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessage = mockOn.mock.calls[5][1]

        const event = {
            message: mockMessage
        }
        onMessage(mockMessage)
        expect(mockLogger.info).toHaveBeenCalledWith('Message received', mockMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message', event)
    })

    it('onMessage (ignore if is status broadcast)', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessage = mockOn.mock.calls[5][1]

        const event = {
            message: mockMessage
        }

        const ignoredMessage = { ...mockMessage, id: { ...mockMessage, id: { ...mockMessage.id, remote: 'status@broadcast' } } }

        onMessage(ignoredMessage)
        expect(mockLogger.info).not.toHaveBeenCalledWith('Message received', mockMessage.id)
        expect(mockEventBus.dispatch).not.toHaveBeenCalledWith('whatsapp.message', event)
    })

    it('onMessageCreate', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const mockCreatedMessage = { ...mockMessage, ...{ fromMe: true } }

        const onMessageCreate = mockOn.mock.calls[6][1]

        const event = {
            message: mockCreatedMessage
        }

        onMessageCreate(mockCreatedMessage)
        expect(mockLogger.info).toHaveBeenCalledWith('Message created', mockCreatedMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.create', event)
    })

    it('onMessageCreate (ignore if is not from me)', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const mockCreatedMessage = { ...mockMessage, ...{ fromMe: false } }

        const onMessageCreate = mockOn.mock.calls[6][1]

        const event = {
            message: mockCreatedMessage
        }

        onMessageCreate(mockCreatedMessage)
        expect(mockLogger.info).not.toHaveBeenCalledWith('Message created', mockCreatedMessage)
        expect(mockEventBus.dispatch).not.toHaveBeenCalledWith('whatsapp.message.create', event)
    })

    it('onMessageAck', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()
        const onMessageAck = mockOn.mock.calls[7][1]

        onMessageAck(mockMessage, 1)
        expect(mockLogger.info).toHaveBeenCalledWith('Message ack', mockMessage.id, 1)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.ack', {
            message: mockMessage,
            ack: 1
        })
    })

    it('onMessageRevokeForEveryone', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessageRevokeForEveryone = mockOn.mock.calls[8][1]

        onMessageRevokeForEveryone(mockMessage, mockMessage)
        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for everyone', mockMessage.id, mockMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_everyone', {
            message: mockMessage,
            revokedMessage: mockMessage
        })
    })

    it('onMessageRevokeForMe', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessageRevokeForMe = mockOn.mock.calls[9][1]

        const event = {
            message: mockMessage
        }

        onMessageRevokeForMe(mockMessage)
        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for me', mockMessage.id)

        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_me', event)
    })

    it('onChangeState', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onChangeState = mockOn.mock.calls[10][1]

        onChangeState('state')
        expect(mockLogger.info).toHaveBeenCalledWith('State changed', 'state')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.state', { state: 'state' })
    })

    it('start client with error', async () => {
        const exitMock = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)

        const error = new Error('error')
        mockInitialize.mockRejectedValue(error)

        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        expect(mockLogger.error).toHaveBeenCalledWith('Client fatal error', error)
        expect(exitMock).toHaveBeenCalledWith(1)
    })
})
