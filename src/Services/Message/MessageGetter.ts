import { IChatFinder } from './../Chat/ChatFinder'
import { Message } from 'whatsapp-web.js'

export interface IMessageGetter {
    all: (chatId: string, limit?: number) => Promise<Message[]>
}

export default class MessageGetter implements IMessageGetter {
    public constructor (
        private readonly chatFinder: IChatFinder
    ) {}

    public async all (chatId: string, limit?: number, _fromMe?: boolean): Promise<Message[]> {
        const chat = await this.chatFinder.find(chatId)
        return await chat.fetchMessages({ limit: undefined === limit ? 100 : limit, fromMe: _fromMe })
    }
}
