import { IChatFinder } from './ChatFinder'
export interface IChatReader {
    read: (id: string) => Promise<void>
    unread: (id: string) => Promise<void>
}

export default class ChatReader implements IChatReader {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async read (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.sendSeen()
    }

    public async unread (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.markUnread()
    }
}
