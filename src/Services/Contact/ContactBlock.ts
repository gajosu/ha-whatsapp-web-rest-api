import { IContactFinder } from './ContactFinder'

export interface IContactBlock {
    block: (contactId: string) => Promise<boolean>
    unblock: (contactId: string) => Promise<boolean>
}

export default class ContactBlock implements IContactBlock {
    constructor (private readonly whatsapp: IContactFinder) {}

    async block (contactId: string): Promise<boolean> {
        const contact = await this.whatsapp.find(contactId)
        return await contact.block()
    }

    async unblock (contactId: string): Promise<boolean> {
        const contact = await this.whatsapp.find(contactId)
        return await contact.unblock()
    }
}
