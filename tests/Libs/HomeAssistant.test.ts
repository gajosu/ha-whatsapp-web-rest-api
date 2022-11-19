import mockConfig from '../stubs/GlobalConfig'
import mockLogger from '../stubs/Logger'
import mockEventBus from '../stubs/EventBus'
import mockEventPublisher from '../stubs/HaEventPublisher'
import HomeAssistant from './../../src/Libs/HomeAssistant'

describe('Home assistant', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('start ha service', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        expect(mockLogger.info).toHaveBeenCalledWith('Home Assistant integration enabled')
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.create', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.ack', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.state', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.authenticated', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.disconnected', expect.any(Function))
    })

    it('not start ha service', async () => {
        mockConfig.mockReturnValue(undefined)

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        expect(mockLogger.warn).toHaveBeenCalledWith('Home Assistant integration disabled')
    })

    it('onMessage', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        const onMessage = mockEventBus.register.mock.calls[0][1]
        await onMessage({ message: { id: 'id' } })

        expect(mockLogger.info).toHaveBeenCalledWith('onMessage', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_received', { message: { id: 'id' } }, 'token')
    })

    it('onCreatedMessage', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        const onCreatedMessage = mockEventBus.register.mock.calls[1][1]
        await onCreatedMessage({ message: { id: 'id' } })

        expect(mockLogger.info).toHaveBeenCalledWith('onCreatedMessage', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_sent', { message: { id: 'id' } }, 'token')
    })

    it('onMessageAck', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        const event = { message: { id: 'id' }, ack: 1 }
        const onMessageAck = mockEventBus.register.mock.calls[2][1]
        await onMessageAck(event)

        expect(mockLogger.info).toHaveBeenCalledWith('onMessageAck', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_ack', event, 'token')
    })

    it('onState', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()

        const event = { state: 'state' }
        const onState = mockEventBus.register.mock.calls[3][1]
        await onState(event)

        expect(mockLogger.info).toHaveBeenCalledWith('onChangedState', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_state', event, 'token')
    })

    it('onAuthenticated', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()
        const onAuthenticated = mockEventBus.register.mock.calls[4][1]
        await onAuthenticated()

        expect(mockLogger.info).toHaveBeenCalledWith('onAuthenticated')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_authenticated', {}, 'token')
    })

    it('onDisconnected', async () => {
        mockConfig.mockReturnValue('token')

        const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
        ha.start()
        const onDisconnected = mockEventBus.register.mock.calls[5][1]
        await onDisconnected()

        expect(mockLogger.info).toHaveBeenCalledWith('onDisconnected')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_disconnected', {}, 'token')
    })
})
