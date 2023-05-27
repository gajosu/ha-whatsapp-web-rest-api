
import mockLogger from '../stubs/Logger'
import mockEventBus from '../stubs/EventBus'
import Whatsapp from '../../src/Libs/Whatsapp'
import { Client } from 'whatsapp-web.js'
import { findCallback } from '../utils/Utils'

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

const mockMessageReaction = {
    id: {
        fromMe: false,
        remote: '554199999999@c.us',
        id: '1',
        _serialized: 'false_1_1'
    },

    orphan: 1,
    orphanReason: 'reason',
    timestamp: 1591482682,
    reaction: '👍',
    read: false,
    msgId: {
        fromMe: false,
        remote: '554199999999@c.us',
        id: '1',
        _serialized: 'false_1_1'
    },
    senderId: 'ID',
    ack: -1
}

const mockGroupNotification = {
    id: {
        fromMe: false,
        remote: '1',
        id: '1',
        _serialized: 'false_1_1'
    },
    author: 'AUTHOR',
    body: 'BODY',
    recipientIds: [
        'ID'
    ],
    timestamp: 1591482682,
    type: 'add'
}

const mockCall = {
    id: '1',
    from: 'PARTICIPANT',
    timestamp: 1591482682,
    isVideo: false,
    isGroup: false,
    fromMe: false,
    canHandleLocally: false,
    webClientShouldHandle: false,
    participants: {}
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
        expect(mockOn).toHaveBeenCalledWith('loading_screen', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('authenticated', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('auth_failure', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('disconnected', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message_create', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message_ack', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message_reaction', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message_revoke_everyone', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('message_revoke_me', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('group_join', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('group_leave', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('group_update', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('incoming_call', expect.any(Function))
        expect(mockOn).toHaveBeenCalledWith('change_state', expect.any(Function))
    })

    it('onQr', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onQr = findCallback(mockOn.mock, 'qr')
        onQr('qr')

        expect(mockLogger.debug).toHaveBeenCalledWith('QR Code Received', 'qr')
    })

    it('onReady', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onReady = findCallback(mockOn.mock, 'ready')
        onReady()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is ready!')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.ready')
    })

    it('onLoadingScreen', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onLoadingScreen = findCallback(mockOn.mock, 'loading_screen')
        onLoadingScreen()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is loading screen')
    })

    it('onAuthenticated', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onAuthenticated = findCallback(mockOn.mock, 'authenticated')
        onAuthenticated()

        expect(mockLogger.info).toHaveBeenCalledWith('Client is authenticated')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.authenticated')
    })

    it('onAuthFailure', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onAuthFailure = findCallback(mockOn.mock, 'auth_failure')
        onAuthFailure('error')

        expect(mockLogger.error).toHaveBeenCalledWith('Client authentication failure', { message: 'error' })
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.auth_failure', { message: 'error' })
    })

    it('onDisconnected', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onDisconnected = findCallback(mockOn.mock, 'disconnected')
        await onDisconnected('reason')

        expect(mockLogger.info).toHaveBeenCalledWith('Client is disconnected', 'reason')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.disconnected', { state: 'reason' })
    })

    it('onMessage', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessage = findCallback(mockOn.mock, 'message')

        const event = {
            message: mockMessage
        }
        onMessage(mockMessage)
        expect(mockLogger.debug).toHaveBeenCalledWith('Message received', mockMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message', event)
    })

    it('onMessage (ignore if is status broadcast)', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessage = findCallback(mockOn.mock, 'message')

        const event = {
            message: mockMessage
        }

        const ignoredMessage = { ...mockMessage, id: { ...mockMessage, id: { ...mockMessage.id, remote: 'status@broadcast' } } }

        onMessage(ignoredMessage)
        expect(mockLogger.debug).not.toHaveBeenCalledWith('Message received', mockMessage.id)
        expect(mockEventBus.dispatch).not.toHaveBeenCalledWith('whatsapp.message', event)
    })

    it('onMessageCreate', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const mockCreatedMessage = { ...mockMessage, ...{ fromMe: true } }

        const onMessageCreate = findCallback(mockOn.mock, 'message_create')

        const event = {
            message: mockCreatedMessage
        }

        onMessageCreate(mockCreatedMessage)
        expect(mockLogger.debug).toHaveBeenCalledWith('Message created', mockCreatedMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.create', event)
    })

    it('onMessageCreate (ignore if is not from me)', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const mockCreatedMessage = { ...mockMessage, ...{ fromMe: false } }

        const onMessageCreate = findCallback(mockOn.mock, 'message_create')

        const event = {
            message: mockCreatedMessage
        }

        onMessageCreate(mockCreatedMessage)
        expect(mockLogger.debug).not.toHaveBeenCalledWith('Message created', mockCreatedMessage)
        expect(mockEventBus.dispatch).not.toHaveBeenCalledWith('whatsapp.message.create', event)
    })

    it('onMessageAck', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()
        const onMessageAck = findCallback(mockOn.mock, 'message_ack')

        onMessageAck(mockMessage, 1)
        expect(mockLogger.debug).toHaveBeenCalledWith('Message ack', mockMessage.id, 1)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.ack', {
            message: mockMessage,
            ack: 1
        })
    })

    it('onMessageReaction', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessageReaction = findCallback(mockOn.mock, 'message_reaction')

        onMessageReaction(mockMessageReaction, 'reaction')
        expect(mockLogger.debug).toHaveBeenCalledWith('Message reaction', mockMessageReaction)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.reaction', {
            reaction: mockMessageReaction
        })
    })

    it('onMessageRevokeForEveryone', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessageRevokeForEveryone = findCallback(mockOn.mock, 'message_revoke_everyone')

        onMessageRevokeForEveryone(mockMessage, mockMessage)
        expect(mockLogger.debug).toHaveBeenCalledWith('Message revoke for everyone', mockMessage.id, mockMessage.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_everyone', {
            message: mockMessage,
            revokedMessage: mockMessage
        })
    })

    it('onMessageRevokeForMe', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onMessageRevokeForMe = findCallback(mockOn.mock, 'message_revoke_me')

        const event = {
            message: mockMessage
        }

        onMessageRevokeForMe(mockMessage)
        expect(mockLogger.debug).toHaveBeenCalledWith('Message revoke for me', mockMessage.id)

        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.message.revoke_for_me', event)
    })

    it('onGroupJoin', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onGroupJoin = findCallback(mockOn.mock, 'group_join')
        onGroupJoin(mockGroupNotification)

        expect(mockLogger.debug).toHaveBeenCalledWith('Group join', mockGroupNotification.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.group.join', {
            notification: mockGroupNotification
        })
    })

    it('onGroupLeave', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onGroupLeave = findCallback(mockOn.mock, 'group_leave')
        onGroupLeave(mockGroupNotification)

        expect(mockLogger.debug).toHaveBeenCalledWith('Group leave', mockGroupNotification.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.group.leave', {
            notification: mockGroupNotification
        })
    })

    it('onGroupUpdate', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onGroupUpdate = findCallback(mockOn.mock, 'group_update')
        onGroupUpdate(mockGroupNotification)

        expect(mockLogger.debug).toHaveBeenCalledWith('Group update', mockGroupNotification.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.group.update', {
            notification: mockGroupNotification
        })
    })

    it('onCall', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onCall = findCallback(mockOn.mock, 'incoming_call')
        onCall(mockCall)

        expect(mockLogger.debug).toHaveBeenCalledWith('Call', mockCall.id)
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('whatsapp.call', {
            call: mockCall
        })
    })

    it('onChangeState', async () => {
        const whatsapp = new Whatsapp(new Client({}), mockLogger, mockEventBus)
        await whatsapp.start()

        const onChangeState = findCallback(mockOn.mock, 'change_state')

        onChangeState('state')
        expect(mockLogger.debug).toHaveBeenCalledWith('State changed', 'state')
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
