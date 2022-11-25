import { IChatFinder } from './ChatFinder'
export interface IChatMute {
    mute: (id: string) => Promise<void>
    unmute: (id: string) => Promise<void>
}

export default class ChatMute implements IChatMute {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async mute (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        // await chat.mute()
        const unmuteDate = new Date()
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20)
        await chat.mute(unmuteDate)
    }

    public async unmute (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.unmute()
    }
}
