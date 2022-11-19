import { IEventPublisher } from './../Services/HomeAssistant/EventPublisher'
import { IEventBus } from './EventBus'
import getConfig from '../config/GlobalConfig'
import { ILogger } from './Logger'
import { IMessageAckEvent, IMessageEvent, IStateChangeEvent } from './Whatsapp'

export interface IHomeAssistant {
    start: () => void
}

export default class HomeAssistant implements IHomeAssistant {
    private readonly supervisorToken: string | undefined = getConfig<string>('supervisorToken', undefined)

    public constructor (
        private readonly logger: ILogger,
        private readonly eventBus: IEventBus,
        private readonly eventPublisher: IEventPublisher
    ) {
        this.logger = logger.getCategoryLogger('HomeAssistant', 'blue')
    }

    public start (): void {
        if (this.supervisorToken === undefined) {
            this.logger.warn('Home Assistant integration disabled')
            return
        }

        this.logger.info('Home Assistant integration enabled')

        this.eventBus.register('whatsapp.message', this.onMessage.bind(this))
        this.eventBus.register('whatsapp.message.create', this.onCreatedMessage.bind(this))
        this.eventBus.register('whatsapp.message.ack', this.onMessageAck.bind(this))
        this.eventBus.register('whatsapp.state', this.onChangedState.bind(this))
        this.eventBus.register('whatsapp.authenticated', this.onAuthenticated.bind(this))
        this.eventBus.register('whatsapp.disconnected', this.onDisconnected.bind(this))
    }

    private async onMessage (data: IMessageEvent): Promise<void> {
        this.logger.info('onMessage', data.message.id)
        await this.sendToHomeAssistant('message_received', data)
    }

    private async onCreatedMessage (data: IMessageEvent): Promise<void> {
        this.logger.info('onCreatedMessage', data.message.id)
        await this.sendToHomeAssistant('message_sent', data)
    }

    private async onMessageAck (data: IMessageAckEvent): Promise<void> {
        this.logger.info('onMessageAck', data)
        await this.sendToHomeAssistant('message_ack', data)
    }

    private async onChangedState (data: IStateChangeEvent): Promise<void> {
        this.logger.info('onChangedState', data)
        await this.sendToHomeAssistant('state', data)
    }

    private async onAuthenticated (): Promise<void> {
        this.logger.info('onAuthenticated')
        await this.sendToHomeAssistant('authenticated', {})
    }

    private async onDisconnected (): Promise<void> {
        this.logger.info('onDisconnected')
        await this.sendToHomeAssistant('disconnected', {})
    }

    private async sendToHomeAssistant (event: string, data: any): Promise<void> {
        await this.eventPublisher.publish('whatsapp_' + event, data, this.supervisorToken as string)
    }
}
