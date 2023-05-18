import { IWhatsapp } from './../../Libs/Whatsapp'
import { IGroupChatFinder } from './GroupChatFinder'
export interface IGroupChatInvite {
    getCode: (groupId: string) => Promise<string>
    revokeCode: (groupId: string) => Promise<void>
    acceptInvite: (inviteCode: string) => Promise<string>
    leave: (groupId: string) => Promise<void>
}

export default class GroupChatInvite implements IGroupChatInvite {
    public constructor (
        private readonly whatsapp: IWhatsapp,
        private readonly groupFinder: IGroupChatFinder
    ) {}

    public async getCode (groupId: string): Promise<string> {
        const chat = await this.groupFinder.find(groupId)

        return await chat.getInviteCode()
    }

    public async revokeCode (groupId: string): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.revokeInvite()
    }

    /**
     * Accepts an invite code and returns the group id
     *
     * @param {string} inviteCode
     * @returns {Promise<string>} Group ID
     */
    public async acceptInvite (inviteCode: string): Promise<string> {
        const client = this.whatsapp.getClient()

        return await client.acceptInvite(inviteCode)
    }

    public async leave (groupId: string): Promise<void> {
        const chat = await this.groupFinder.find(groupId)

        await chat.leave()
    }
}
