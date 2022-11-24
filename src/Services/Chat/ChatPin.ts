import { IChatFinder } from './ChatFinder'
export interface IChatPin {
    pin: (id: string) => Promise<void>
    unpin: (id: string) => Promise<void>
}

export default class ChatPin implements IChatPin {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async pin (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.pin()
    }

    public async unpin (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unpin()
    }
}
