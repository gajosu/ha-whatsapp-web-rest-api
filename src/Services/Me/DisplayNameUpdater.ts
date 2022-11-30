import { IWhatsapp } from '../../Libs/Whatsapp'

export interface IDisplayNameUpdater {
    update: (displayName: string) => Promise<boolean>
}

export default class DisplayNameUpdater implements IDisplayNameUpdater {
    constructor (private readonly whatsapp: IWhatsapp) {}

    public async update (displayName: string): Promise<boolean> {
        return await this.whatsapp.getClient().setDisplayName(displayName)
    }
}
