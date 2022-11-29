import { IChatFinder } from './../Chat/ChatFinder'
import { IWhatsapp } from '../../Libs/Whatsapp'
import { Message } from 'whatsapp-web.js'

export interface IMessageGetter {
    all: (chatId: string) => Promise<Message[]>
}

export default class MessageGetter implements IMessageGetter {
    public constructor (
        private readonly whatsapp: IWhatsapp,
        private readonly chatFinder: IChatFinder
    ) {}

    public async all (chatId: string): Promise<Message[]> {
        const chat = await this.chatFinder.find(chatId)
        return await chat.fetchMessages({ limit: Infinity })
    }
}
