import { IChatFinder } from './ChatFinder'
export interface IChatMessageClear {
    clear: (id: string) => Promise<void>
}

export default class ChatMessageClear implements IChatMessageClear {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async clear (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.clearMessages()
    }
}
