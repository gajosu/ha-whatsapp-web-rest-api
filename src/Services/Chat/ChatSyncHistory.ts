import { IWhatsapp } from '../../Libs/Whatsapp'

export interface IChatSyncHistory {
    sync: (chatId: string) => Promise<boolean>
}

export default class ChatSyncHistory implements IChatSyncHistory {
    public constructor (
        private readonly whatsapp: IWhatsapp
    ) {}

    public async sync (chatId: string): Promise<boolean> {
        const client = this.whatsapp.getClient()
        return await client.syncHistory(chatId)
    }
}
