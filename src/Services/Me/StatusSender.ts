import { IWhatsapp } from '../../Libs/Whatsapp'

export interface IStatusSender {
    available: () => Promise<void>
    unavailable: () => Promise<void>
}

export default class StatusSender implements IStatusSender {
    constructor (private readonly whatsapp: IWhatsapp) {}

    public async available (): Promise<void> {
        await this.whatsapp.getClient().sendPresenceAvailable()
    }

    public async unavailable (): Promise<void> {
        await this.whatsapp.getClient().sendPresenceUnavailable()
    }
}
