import { IChatFinder } from './ChatFinder'
export interface IChatUnpin {
    unpin: (id: string) => Promise<void>
}

export default class ChatUnpin implements IChatUnpin {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async unpin (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unpin()
    }
}
