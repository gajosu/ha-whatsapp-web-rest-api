import { CreateGroupResult } from 'whatsapp-web.js'
import { IWhatsapp } from './../../Libs/Whatsapp'
export interface IGroupChatCreator {
    create: (name: string, participants: string[]) => Promise<CreateGroupResult>
}

export default class GroupChatCreator implements IGroupChatCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (name: string, participants: string[]): Promise<CreateGroupResult> {
        const client = this.whatsapp.getClient()

        const chat = await client.createGroup(name, participants)

        return chat
    }
}
