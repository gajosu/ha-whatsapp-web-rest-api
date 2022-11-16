import { IWhatsapp } from '../../Libs/Whatsapp'
import { Message, MessageMedia } from 'whatsapp-web.js'

export interface IMediaUrlMessageCreator {
    create: (to: string, url: string) => Promise < Message >
}

export default class MediaUrlMessageCreator implements IMediaUrlMessageCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (to: string, url: string): Promise < Message > {
        const message = await MessageMedia.fromUrl(url, { unsafeMime: true })
        const messageInstance = await this.whatsapp.getClient().sendMessage(to, message)
        return messageInstance
    }
}
