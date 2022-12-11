import fetch from 'node-fetch'
import { ILogger } from '../../Libs/Logger'

export interface IEventPublisher {
    publish: (event: string, data: any) => Promise<void>
}

export default class EventPublisher implements IEventPublisher {
    public constructor (
        private readonly logger: ILogger,
        private readonly token?: string,
        private readonly haHost?: string
    ) {
        this.logger = logger.getCategoryLogger('Home Assistant EventPublisher', 'blue')
    }

    private getBaseUri (): string {
        return this.haHost ?? 'http://supervisor/core'
    }

    public async publish (event: string, data: any): Promise<void> {
        await fetch(`${this.getBaseUri()}/api/events/${event}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status !== 200) {
                this.logger.error(`Error publishing event ${event} to Home Assistant: ${response.statusText}`)
                this.logger.error(`with token ${this.token}`)
            } else {
                this.logger.debug(`Event ${event} published to Home Assistant`)
            }
        }).catch((err) => {
            this.logger.error('Error sending event to Home Assistant', err)
        })
    }
}
