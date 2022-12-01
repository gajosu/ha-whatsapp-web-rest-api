import { IChatFinder } from './ChatFinder'
export interface IChatArchive {
    archive: (id: string) => Promise<void>
    unarchive: (id: string) => Promise<void>
}

export default class ChatArchive implements IChatArchive {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async archive (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.archive()
    }

    public async unarchive (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unarchive()
    }
}
