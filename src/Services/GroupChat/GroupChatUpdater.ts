import { IGroupChatFinder } from './GroupChatFinder'
export interface IGroupChatUpdater {
    update: (id: string, subject: string, description?: string) => Promise<void>
}

export default class GroupChatUpdater implements IGroupChatUpdater {
    public constructor (private readonly groupFinder: IGroupChatFinder) {}

    public async update (groupId: string, subject: string, description?: string): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.setSubject(subject)
        if (description !== undefined) {
            await chat.setDescription(description)
        }
    }
}
