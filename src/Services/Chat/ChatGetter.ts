import { Chat } from 'whatsapp-web.js'
import { IWhatsapp } from '../../Libs/Whatsapp'
export interface IChatGetter {
    all: () => Promise<Chat[]>
}

export default class ChatGetter implements IChatGetter {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async all (): Promise<Chat[]> {
        const client = this.whatsapp.getClient()
        const chats = await client.getChats()

        return chats
    }
}
