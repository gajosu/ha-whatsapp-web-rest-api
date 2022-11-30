import { NotFoundError } from '../../Exceptions/NotFoundError'
import { IWhatsapp } from '../../Libs/Whatsapp'
import { Chat, GroupChat } from 'whatsapp-web.js'

export interface IGroupChatFinder {
    find: (groupId: string) => Promise<GroupChat>
}

export default class GroupChatFinder implements IGroupChatFinder {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async find (groupId: string): Promise<GroupChat> {
        const client = this.whatsapp.getClient()

        const chat = await client.getChatById(groupId).catch(() => {
            throw new NotFoundError(`Chat (${groupId})`)
        })

        if (!chat.isGroup) {
            throw new NotFoundError(`Group Chat (${groupId})`)
        }

        return chat as GroupChat
    }
}
