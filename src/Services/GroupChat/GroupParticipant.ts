import { IGroupChatFinder } from './GroupChatFinder'
export interface IGroupParticipant {
    add: (groupId: string, participants: string[]) => Promise<void>
    remove: (groupId: string, participants: string[]) => Promise<void>
    promote: (groupId: string, participants: string[]) => Promise<void>
    demote: (groupId: string, participants: string[]) => Promise<void>
}

export default class GroupParticipant implements IGroupParticipant {
    public constructor (private readonly groupFinder: IGroupChatFinder) {}

    public async add (groupId: string, participants: string[]): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.addParticipants(participants)
    }

    public async remove (groupId: string, participants: string[]): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.removeParticipants(participants)
    }

    public async promote (groupId: string, participants: string[]): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.promoteParticipants(participants)
    }

    public async demote (groupId: string, participants: string[]): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.demoteParticipants(participants)
    }
}
