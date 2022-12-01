import { IContactFinder } from './ContactFinder'

export interface IContactBlock {
    block: (contactId: string) => Promise<boolean>
    unblock: (contactId: string) => Promise<boolean>
}

export default class ContactBlock implements IContactBlock {
    constructor (private readonly finder: IContactFinder) {}

    async block (contactId: string): Promise<boolean> {
        const contact = await this.finder.find(contactId)
        return await contact.block()
    }

    async unblock (contactId: string): Promise<boolean> {
        const contact = await this.finder.find(contactId)
        return await contact.unblock()
    }
}
