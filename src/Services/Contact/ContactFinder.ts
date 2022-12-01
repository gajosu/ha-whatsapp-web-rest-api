import { NotFoundError } from './../../Exceptions/NotFoundError'
import { IWhatsapp } from '../../Libs/Whatsapp'
import { Contact } from 'whatsapp-web.js'

export interface IContactFinder {
    find: (contactId: string) => Promise<Contact>
}

export default class ContactFinder implements IContactFinder {
    constructor (private readonly whatsapp: IWhatsapp) {}

    async find (contactId: string): Promise<Contact> {
        const client = await this.whatsapp.getClient()
        const contact = await client.getContactById(contactId)
            .catch(() => {
                throw new NotFoundError(`Contact (${contactId})`)
            })
        return contact
    }
}
