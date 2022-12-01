import { IMessageFinder } from './MessageFinder'

export interface IMessageReact {
    react: (chatId: string, messageId: string, reaction: string) => Promise<void>
}

export default class MessageReact implements IMessageReact {
    public constructor (
        private readonly messageFinder: IMessageFinder
    ) {}

    public async react (chatId: string, messageId: string, reaction: string): Promise<void> {
        const message = await this.messageFinder.find(chatId, messageId)
        return await message.react(reaction)
    }
}
