import fetch from 'node-fetch'
import { ILogger } from '../../Libs/Logger'

export interface IEventPublisher {
    publish: (event: string, data: any, supervisorToken: string) => Promise<void>
}

export default class EventPublisher implements IEventPublisher {
    public constructor (private readonly logger: ILogger) {
        this.logger = logger.getCategoryLogger('Home Assistant EventPublisher', 'blue')
    }

    public async publish (event: string, data: any, supervisorToken: string): Promise<void> {
        await fetch(`http://supervisor/core/api/events/${event}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${supervisorToken}`
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status !== 200) {
                this.logger.error(`Error publishing event ${event} to Home Assistant: ${response.statusText}`)
            } else {
                this.logger.info(`Event ${event} published to Home Assistant`)
            }
        }).catch((err) => {
            this.logger.error('Error sending event to Home Assistant', err)
        })
    }
}
