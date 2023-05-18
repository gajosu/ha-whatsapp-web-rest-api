import { IMessageFinder } from './MessageFinder'

export interface IMessageStar {
    star: (chatId: string, messageId: string) => Promise<void>
    unstar: (chatId: string, messageId: string) => Promise<void>
}

export default class MessageStar implements IMessageStar {
    public constructor (
        private readonly messageFinder: IMessageFinder
    ) {}

    public async star (chatId: string, messageId: string): Promise<void> {
        const message = await this.messageFinder.find(chatId, messageId)
        await message.star()
    }

    public async unstar (chatId: string, messageId: string): Promise<void> {
        const message = await this.messageFinder.find(chatId, messageId)
        await message.unstar()
    }
}
