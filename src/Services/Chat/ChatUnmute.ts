import { IChatFinder } from './ChatFinder'
export interface IChatUnmute {
    unmute: (id: string) => Promise<void>
}

export default class ChatUnmute implements IChatUnmute {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async unmute (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unmute()
    }
}
