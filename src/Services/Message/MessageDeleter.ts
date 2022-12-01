import { IMessageFinder } from './MessageFinder'

export interface IMessageDeleter {
    delete: (chatId: string, messageId: string) => Promise<void>
}

export default class MessageDeleter implements IMessageDeleter {
    public constructor (
        private readonly messageFinder: IMessageFinder
    ) {}

    public async delete (chatId: string, messageId: string): Promise<void> {
        const message = await this.messageFinder.find(chatId, messageId)
        await message.delete(true)
    }
}
