import { IEventBus } from './EventBus'
import getConfig from '../config/GlobalConfig'
import fetch from 'node-fetch'
import { ILogger } from './Logger'

export interface IHomeAssistant {
    start: () => void
}

export class HomeAssistant implements IHomeAssistant {
    private readonly supervisorToken: string | undefined = getConfig<string>('supervisorToken', undefined)

    public constructor (private readonly logger: ILogger, private readonly eventBus: IEventBus) {
        this.logger = logger.getCategoryLogger('HomeAssistant', 'blue')
    }

    public start (): void {
        if (this.supervisorToken === undefined) {
            this.logger.info('Home Assistant integration disabled')
            return
        }

        this.eventBus.register('whatsapp.message', this.onMessage.bind(this))
        this.eventBus.register('whatsapp.message.create', this.onCreatedMessage.bind(this))
        this.eventBus.register('whatsapp.message.ack', this.onMessageAck.bind(this))
        this.eventBus.register('whatsapp.state', this.onChangedState.bind(this))
        this.eventBus.register('whatsapp.authenticated', this.onAuthenticated.bind(this))
        this.eventBus.register('whatsapp.disconnected', this.onDisconnected.bind(this))
    }

    private async sendEvent (event: string, data: any): Promise<void> {
        await fetch(`http://supervisor/core/api/events/${event}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.supervisorToken}`
            },
            body: JSON.stringify(data)
        }).catch((err) => {
            this.logger.error('Error sending event to Home Assistant', err)
        })
    }
}
