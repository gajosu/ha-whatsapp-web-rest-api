import { IWhatsapp } from '../../Libs/Whatsapp'
import { Message, MessageMedia, MessageSendOptions } from 'whatsapp-web.js'

export interface IMediaUrlMessageCreator {
    create: (to: string, url: string, options?: MessageSendOptions) => Promise < Message >
}

export default class MediaUrlMessageCreator implements IMediaUrlMessageCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (to: string, url: string, options?: MessageSendOptions): Promise < Message > {
        const message = await MessageMedia.fromUrl(url, { unsafeMime: true })
        const messageInstance = await this.whatsapp.getClient().sendMessage(to, message, options)
        return messageInstance
    }
}
