import { Message, MessageSendOptions } from 'whatsapp-web.js'
import { IWhatsapp } from '../../Libs/Whatsapp'

export interface ITextMessageCreator {
    create: (to: string, msg: string, options?: MessageSendOptions) => Promise < Message >
}
export default class TextMessageCreator implements ITextMessageCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (to: string, msg: string, options?: MessageSendOptions): Promise < Message > {
        const messageInstance = await this.whatsapp.getClient().sendMessage(to, msg, options)

        return messageInstance
    }
}
