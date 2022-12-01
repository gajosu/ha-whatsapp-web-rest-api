import { IWhatsapp } from '../../Libs/Whatsapp'
import { Contact } from 'whatsapp-web.js'

export interface IContactGetter {
    all: () => Promise<Contact[]>
}

export default class ContactGetter implements IContactGetter {
    constructor (private readonly whatsapp: IWhatsapp) {}

    async all (): Promise<Contact[]> {
        const contacts = await this.whatsapp.getClient().getContacts()
        return contacts
    }
}
