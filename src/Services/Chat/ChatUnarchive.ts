import { IChatFinder } from './ChatFinder'
export interface IChatUnarchive {
    unarchive: (id: string) => Promise<void>
}

export default class ChatUnarchive implements IChatUnarchive {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async unarchive (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unarchive()
    }
}
