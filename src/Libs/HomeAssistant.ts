import { IEventPublisher } from './../Services/HomeAssistant/EventPublisher'
import { IEventBus } from './EventBus'
import { ILogger } from './Logger'
import { IMessageAckEvent, IMessageEvent, IStateChangeEvent, IMessageRevokeForEveryoneEvent, IMessageRevokeForMeEvent, IGroupNotificationEvent, ICallEvent } from './Whatsapp'

export interface IHomeAssistant {
    start: () => void
}

export default class HomeAssistant implements IHomeAssistant {
    public constructor (
        private readonly logger: ILogger,
        private readonly eventBus: IEventBus,
        private readonly eventPublisher: IEventPublisher
    ) {
        this.logger = logger.getCategoryLogger('HomeAssistant', 'blue')
    }

    public start (): void {
        if (process.env.SUPERVISOR_TOKEN === undefined) {
            this.logger.warn('Home Assistant integration disabled')
            return
        }

        this.logger.info('Home Assistant integration enabled')

        this.eventBus.register('whatsapp.authenticated', this.onAuthenticated.bind(this))
        this.eventBus.register('whatsapp.disconnected', this.onDisconnected.bind(this))
        this.eventBus.register('whatsapp.message', this.onMessage.bind(this))
        this.eventBus.register('whatsapp.message.create', this.onCreatedMessage.bind(this))
        this.eventBus.register('whatsapp.message.ack', this.onMessageAck.bind(this))
        this.eventBus.register('whatsapp.message.revoke_for_everyone', this.onMessageRevokeForEveryone.bind(this))
        this.eventBus.register('whatsapp.message.revoke_for_me', this.onMessageRevokeForMe.bind(this))
        this.eventBus.register('whatsapp.group.join', this.onGroupJoin.bind(this))
        this.eventBus.register('whatsapp.group.leave', this.onGroupLeave.bind(this))
        this.eventBus.register('whatsapp.group.update', this.onGroupUpdate.bind(this))
        this.eventBus.register('whatsapp.incoming_call', this.onCall.bind(this))
        this.eventBus.register('whatsapp.state', this.onChangedState.bind(this))
    }

    private async onAuthenticated (): Promise<void> {
        this.logger.info('onAuthenticated')
        await this.sendToHomeAssistant('authenticated', {})
    }

    private async onDisconnected (): Promise<void> {
        this.logger.info('onDisconnected')
        await this.sendToHomeAssistant('disconnected', {})
    }

    private async onMessage (data: IMessageEvent): Promise<void> {
        this.logger.debug('onMessage', data.message.id)
        await this.sendToHomeAssistant('message_received', data.message.rawData)
    }

    private async onCreatedMessage (data: IMessageEvent): Promise<void> {
        this.logger.debug('onCreatedMessage', data.message.id)
        await this.sendToHomeAssistant('message_sent', data.message.rawData)
    }

    private async onMessageAck (data: IMessageAckEvent): Promise<void> {
        const event = {
            message: data.message.rawData,
            ack: data.ack
        }

        this.logger.debug('onMessageAck', event)
        await this.sendToHomeAssistant('message_ack', event)
    }

    private async onMessageRevokeForEveryone (data: IMessageRevokeForEveryoneEvent): Promise<void> {
        this.logger.debug('onMessageRevokeForEveryone', data.message.id)
        await this.sendToHomeAssistant('message_revoke_for_everyone', {
            message: data.message.rawData,
            revokedMessage: data.revokedMessage.rawData
        })
    }

    private async onMessageRevokeForMe (data: IMessageRevokeForMeEvent): Promise<void> {
        this.logger.debug('onMessageRevokeForMe', data.message.id)
        await this.sendToHomeAssistant('message_revoke_for_me', {
            message: data.message.rawData
        })
    }

    private async onGroupJoin (data: IGroupNotificationEvent): Promise<void> {
        this.logger.debug('onGroupJoin', data)
        await this.sendToHomeAssistant('group_join', data)
    }

    private async onGroupLeave (data: IGroupNotificationEvent): Promise<void> {
        this.logger.debug('onGroupLeave', data)
        await this.sendToHomeAssistant('group_leave', data)
    }

    private async onGroupUpdate (data: IGroupNotificationEvent): Promise<void> {
        this.logger.debug('onGroupUpdate', data)
        await this.sendToHomeAssistant('group_update', data)
    }

    private async onCall (data: ICallEvent): Promise<void> {
        this.logger.debug('onCall', data)
        await this.sendToHomeAssistant('call', data)
    }

    private async onChangedState (data: IStateChangeEvent): Promise<void> {
        this.logger.debug('onChangedState', data)
        await this.sendToHomeAssistant('state', data)
    }

    private async sendToHomeAssistant (event: string, data: any): Promise<void> {
        await this.eventPublisher.publish('whatsapp_' + event, data)
    }
}
