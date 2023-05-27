import mockLogger from '../stubs/Logger'
import mockEventBus from '../stubs/EventBus'
import mockEventPublisher from '../stubs/HaEventPublisher'
import HomeAssistant from './../../src/Libs/HomeAssistant'
import { findCallback } from '../utils/Utils'

const mockStartHomeAssistant = (): void => {
    const ha = new HomeAssistant(mockLogger, mockEventBus, mockEventPublisher)
    ha.start()
}

describe('Home assistant', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('not start ha service', async () => {
        mockStartHomeAssistant()

        expect(mockLogger.warn).toHaveBeenCalledWith('Home Assistant integration disabled')
    })

    it('start ha service', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        expect(mockLogger.info).toHaveBeenCalledWith('Home Assistant integration enabled')
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.authenticated', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.disconnected', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.create', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.ack', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.reaction', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.revoke_for_everyone', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.message.revoke_for_me', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.join', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.leave', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.group.update', expect.any(Function))
        expect(mockEventBus.register).toHaveBeenCalledWith('whatsapp.state', expect.any(Function))
    })

    it('onAuthenticated', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onAuthenticated = findCallback(mockEventBus.register.mock, 'whatsapp.authenticated')
        onAuthenticated('message')

        expect(mockLogger.info).toHaveBeenCalledWith('onAuthenticated')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_authenticated', {})
    })

    it('onDisconnected', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onDisconnected = findCallback(mockEventBus.register.mock, 'whatsapp.disconnected')
        onDisconnected()

        expect(mockLogger.info).toHaveBeenCalledWith('onDisconnected')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_disconnected', {})
    })

    it('onMessage', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onMessage = findCallback(mockEventBus.register.mock, 'whatsapp.message')
        onMessage({ message: { id: 'id', rawData: { id: 'id' } } })

        expect(mockLogger.debug).toHaveBeenCalledWith('onMessage', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_received', { id: 'id' })
    })

    it('onCreatedMessage', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onCreatedMessage = findCallback(mockEventBus.register.mock, 'whatsapp.message.create')
        onCreatedMessage({ message: { id: 'id', rawData: { id: 'id' } } })

        expect(mockLogger.debug).toHaveBeenCalledWith('onCreatedMessage', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_sent', { id: 'id' })
    })

    it('onMessageAck', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onMessageAck = findCallback(mockEventBus.register.mock, 'whatsapp.message.ack')
        onMessageAck({ message: { id: 'id', rawData: { id: 'id' } }, ack: 1 })

        const event = { message: { id: 'id' }, ack: 1 }

        expect(mockLogger.debug).toHaveBeenCalledWith('onMessageAck', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_ack', event)
    })

    it('onMessageReaction', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const event = {
            reaction: {
                id: {
                    fromMe: false,
                    remote: '554199999999@c.us'
                },
                reaction: '👍',
                senderId: 'ID',
                ack: -1
            }
        }

        const onMessageReaction = findCallback(mockEventBus.register.mock, 'whatsapp.message.reaction')
        onMessageReaction(event)

        expect(mockLogger.debug).toHaveBeenCalledWith('onMessageReaction', event.reaction)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_reaction', event.reaction)
    })

    it('onMessageRevokeForEveryone', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const message = { id: 'id', rawData: { id: 'id' } }

        const onMessageRevokeForEveryone = findCallback(mockEventBus.register.mock, 'whatsapp.message.revoke_for_everyone')
        onMessageRevokeForEveryone({ message, revokedMessage: message })

        const event = { message: message.rawData, revokedMessage: message.rawData }

        expect(mockLogger.debug).toHaveBeenCalledWith('onMessageRevokeForEveryone', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_revoke_for_everyone', event)
    })

    it('onMessageRevokeForMe', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const message = { id: 'id', rawData: { id: 'id' } }

        const onMessageRevokeForMe = findCallback(mockEventBus.register.mock, 'whatsapp.message.revoke_for_me')
        onMessageRevokeForMe({ message })

        const event = { message: message.rawData }

        expect(mockLogger.debug).toHaveBeenCalledWith('onMessageRevokeForMe', 'id')
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_message_revoke_for_me', event)
    })

    it('onGroupJoin', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onGroupJoin = findCallback(mockEventBus.register.mock, 'whatsapp.group.join')

        const event = {
            group: {}
        }

        onGroupJoin(event)

        expect(mockLogger.debug).toHaveBeenCalledWith('onGroupJoin', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_group_join', event)
    })

    it('onGroupLeave', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onGroupLeave = findCallback(mockEventBus.register.mock, 'whatsapp.group.leave')

        const event = {
            group: {}
        }

        onGroupLeave(event)

        expect(mockLogger.debug).toHaveBeenCalledWith('onGroupLeave', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_group_leave', event)
    })

    it('onGroupUpdate', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const onGroupUpdate = findCallback(mockEventBus.register.mock, 'whatsapp.group.update')

        const event = {
            group: {}
        }

        onGroupUpdate(event)

        expect(mockLogger.debug).toHaveBeenCalledWith('onGroupUpdate', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_group_update', event)
    })

    it('onState', async () => {
        process.env.SUPERVISOR_TOKEN = 'token'

        mockStartHomeAssistant()

        const event = { state: 'state' }
        const onState = findCallback(mockEventBus.register.mock, 'whatsapp.state')
        onState(event)

        expect(mockLogger.debug).toHaveBeenCalledWith('onChangedState', event)
        expect(mockEventPublisher.publish).toHaveBeenCalledWith('whatsapp_state', event)
    })
})
