import { Message } from 'whatsapp-web.js'
import { IChatFinder } from './../Chat/ChatFinder'
import { NotFoundError } from '../../Exceptions/NotFoundError'

export interface IMessageFinder {
    find: (chatId: string, messageId: string) => Promise<Message>
}

export default class MessageFinder implements IMessageFinder {
    public constructor (
        private readonly chatFinder: IChatFinder
    ) {}

    public async find (chatId: string, messageId: string): Promise<Message> {
        const chat = await this.chatFinder.find(chatId)
        const messages = await chat.fetchMessages({ limit: Infinity })
        const message = messages.find(message => message.id.id === messageId)

        if (message === undefined) {
            throw new NotFoundError(`Message (${messageId})`)
        }

        return message
    }
}
