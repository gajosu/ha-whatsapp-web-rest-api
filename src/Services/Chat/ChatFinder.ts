import { NotFoundError } from '../../Exceptions/NotFoundError'
import { IWhatsapp } from '../../Libs/Whatsapp'
import { Chat } from 'whatsapp-web.js'

export interface IChatFinder {
    find: (id: string) => Promise<Chat>
}

export default class ChatFinder implements IChatFinder {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async find (id: string): Promise<Chat> {
        const client = this.whatsapp.getClient()

        const chat = await client.getChatById(id).catch(() => {
            throw new NotFoundError(`Chat (${id})`)
        })

        return chat
    }
}
