import { IChatFinder } from './ChatFinder'
export interface IChatStateSender {
    typing: (id: string) => Promise<void>
    recording: (id: string) => Promise<void>
    clear: (id: string) => Promise<void>
}

export default class ChatStateSender implements IChatStateSender {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async typing (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.sendStateTyping()
    }

    public async recording (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.sendStateRecording()
    }

    public async clear (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.clearState()
    }
}
