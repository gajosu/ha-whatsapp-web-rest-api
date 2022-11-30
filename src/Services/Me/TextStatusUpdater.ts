import { IWhatsapp } from '../../Libs/Whatsapp'

export interface ITextStatusUpdater {
    update: (textStatus: string) => Promise<void>
}

export default class TextStatusUpdater implements ITextStatusUpdater {
    constructor (private readonly whatsapp: IWhatsapp) {}

    public async update (textStatus: string): Promise<void> {
        return await this.whatsapp.getClient().setStatus(textStatus)
    }
}
