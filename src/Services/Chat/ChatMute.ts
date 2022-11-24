import { IChatFinder } from './ChatFinder'
export interface IChatMute {
    mute: (id: string) => Promise<void>
}

export default class ChatMute implements IChatMute {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async mute (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.mute()
    }
}
