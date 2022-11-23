import mockLogger from '../stubs/Logger'
import mockEventBus from '../stubs/EventBus'
import WebSocket from '../../src/Libs/WebSocket'
import Logger from '../../src/Libs/Logger'
import { IQRCodeEvent } from '../../src/Libs/Whatsapp'
import httpServer from 'http'
import { findCallback } from '../utils/Utils'

const mockOn = jest.fn()
const mockEmit = jest.fn()
// mock client
jest.mock('socket.io', () => {
    return {
        Server: jest.fn().mockImplementation(() => {
            return {
                on: mockOn,
                emit: mockEmit
            }
        })
    }
})

jest.mock('http')

const mockStartWebSocket = (): void => {
    const http = httpServer.createServer()
    const websocket = new WebSocket(http, new Logger(), mockEventBus)
    websocket.start()
}

describe('WebSocket tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('start socket', async () => {
        mockStartWebSocket()

        expect(mockLogger.info).toHaveBeenCalledWith('Starting WebSocket')
        expect(mockOn).toHaveBeenCalledWith('connection', expect.any(Function))

        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.authenticated', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.auth_failure', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.disconnected', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.create', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.ack', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.revoke_for_everyone', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.revoke_for_me', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.join', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.leave', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.update', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.call', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.state', expect.any(Function))
    })

    it('onConnection', async () => {
        mockStartWebSocket()

        const mockSocket = {
            id: '123',
            emit: jest.fn(),
            on: jest.fn()
        }

        const onConnection = mockOn.mock.calls[0][1]
        onConnection(mockSocket)

        expect(mockLogger.info).toHaveBeenCalledWith('New connection from 123')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('socket.connection', mockSocket)

        // mock eventbus whatsapp.qr event
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.qr', expect.any(Function))

        const mockQr = 'mockQr'
        const onQr = findCallback(mockEventBus.register.mock, 'whatsapp.qr')
        const event: IQRCodeEvent = {
            qr: mockQr
        }

        onQr(event)
        // expect(mockSocket.emit).toHaveBeenCalledWith('qr_code', { data: mockQr })

        const onDisconnect = findCallback(mockSocket.on.mock, 'disconnect')
        onDisconnect('reason')
        expect(mockLogger.info).toHaveBeenCalledWith('Disconnect from 123, reason: reason')
        expect(mockEventBus.dispatch).toHaveBeenCalledWith('socket.disconnect', mockSocket)
    })

    it('onAuthenticated', async () => {
        mockStartWebSocket()

        const onAuthenticated = findCallback(mockEventBus.register.mock, 'whatsapp.authenticated')
        onAuthenticated()

        expect(mockEmit).toHaveBeenCalledWith('authenticated')
        expect(mockLogger.info).toHaveBeenCalledWith('Authenticated')
    })

    it('onAuthFailure', async () => {
        mockStartWebSocket()

        const onAuthFailure = findCallback(mockEventBus.register.mock, 'whatsapp.auth_failure')
        onAuthFailure({
            message: 'message'
        })

        expect(mockEmit).toHaveBeenCalledWith('auth_failure', { message: 'message' })
        expect(mockLogger.info).toHaveBeenCalledWith('Auth failure')
    })

    it('onDisconnected', async () => {
        mockStartWebSocket()

        const onDisconnected = findCallback(mockEventBus.register.mock, 'whatsapp.disconnected')
        onDisconnected({
            state: 'reason'
        })

        expect(mockEmit).toHaveBeenCalledWith('disconnected', { state: 'reason' })
        expect(mockLogger.info).toHaveBeenCalledWith('Disconnected')
    })

    it('onMessage', async () => {
        mockStartWebSocket()

        const mockData = { message: { id: 'id', rawData: { id: 'id' } } }
        const onMessage = findCallback(mockEventBus.register.mock, 'whatsapp.message')
        onMessage(mockData)
        expect(mockEmit).toHaveBeenCalledWith('message', mockData.message.rawData)
    })

    it('onCreatedMessage', async () => {
        mockStartWebSocket()

        const mockData = { message: { id: 'id', rawData: { id: 'id' } } }
        const onCreatedMessage = findCallback(mockEventBus.register.mock, 'whatsapp.message.create')
        onCreatedMessage(mockData)
        expect(mockEmit).toHaveBeenCalledWith('message.create', mockData.message.rawData)
    })

    it('onMessageAck', async () => {
        mockStartWebSocket()

        const mockMessage = { message: { id: 'id', rawData: { id: 'id' } }, ack: 1 }
        const onMessageAck = findCallback(mockEventBus.register.mock, 'whatsapp.message.ack')
        onMessageAck(mockMessage)
        expect(mockEmit).toHaveBeenCalledWith('message.ack', { message: mockMessage.message.rawData, ack: mockMessage.ack })
    })

    it('onRevokeForEveryone', async () => {
        mockStartWebSocket()

        const message = { id: 'id', rawData: { id: 'id' } }
        const mockData = { message, revokedMessage: message }
        const onRevokeForEveryone = findCallback(mockEventBus.register.mock, 'whatsapp.revoke_for_everyone')
        onRevokeForEveryone(mockData)
        expect(mockEmit).toHaveBeenCalledWith('message.revoke_for_everyone', {
            message: mockData.message.rawData,
            revokedMessage: mockData.revokedMessage.rawData
        })

        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for everyone')
    })

    it('onRevokeForMe', async () => {
        mockStartWebSocket()

        const message = { id: 'id', rawData: { id: 'id' } }
        const mockData = { message }
        const onRevokeForMe = findCallback(mockEventBus.register.mock, 'whatsapp.revoke_for_me')
        onRevokeForMe(mockData)
        expect(mockEmit).toHaveBeenCalledWith('message.revoke_for_me', {
            message: mockData.message.rawData
        })

        expect(mockLogger.info).toHaveBeenCalledWith('Message revoke for me')
    })

    it('onGroupJoin', async () => {
        mockStartWebSocket()

        const mockData = { participant: 'participant', group: 'group' }
        const onGroupJoin = findCallback(mockEventBus.register.mock, 'whatsapp.group.join')
        onGroupJoin(mockData)
        expect(mockEmit).toHaveBeenCalledWith('group.join', mockData)
    })

    it('onGroupLeave', async () => {
        mockStartWebSocket()

        const mockData = { participant: 'participant', group: 'group' }
        const onGroupLeave = findCallback(mockEventBus.register.mock, 'whatsapp.group.leave')
        onGroupLeave(mockData)
        expect(mockEmit).toHaveBeenCalledWith('group.leave', mockData)
    })

    it('onGroupUpdate', async () => {
        mockStartWebSocket()

        const mockData = { group: 'group' }
        const onGroupUpdate = findCallback(mockEventBus.register.mock, 'whatsapp.group.update')
        onGroupUpdate(mockData)
        expect(mockEmit).toHaveBeenCalledWith('group.update', mockData)
    })

    it('onCall', async () => {
        mockStartWebSocket()

        const mockData = { call: 'call' }
        const onCall = findCallback(mockEventBus.register.mock, 'whatsapp.call')
        onCall(mockData)
        expect(mockEmit).toHaveBeenCalledWith('call', mockData)
    })

    it('onStateChange', async () => {
        mockStartWebSocket()

        const mockData = { state: 'state' }
        const onStateChange = findCallback(mockEventBus.register.mock, 'whatsapp.state')
        onStateChange(mockData)
        expect(mockEmit).toHaveBeenCalledWith('state.change', mockData)
    })
})
