import { IChatFinder } from './ChatFinder'

export interface IChatDeleter {
    delete: (id: string) => Promise<void>
}

export default class ChatDeleter implements IChatDeleter {
    public constructor (private readonly chatFinder: IChatFinder) {}

    public async delete (id: string): Promise<void> {
        const chat = await this.chatFinder.find(id)
        await chat.delete()
    }
}
