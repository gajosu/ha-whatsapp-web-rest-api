import { NotFoundError } from './../../Exceptions/NotFoundError'
import { IWhatsapp } from '../../Libs/Whatsapp'

export interface INumberValidator {
    validate: (userId: string) => Promise<boolean>
}

export default class NumberValidator implements INumberValidator {
    constructor (private readonly whatsapp: IWhatsapp) {}

    async validate (userId: string): Promise<boolean> {
        const client = this.whatsapp.getClient()
        const isRegistered = await client.isRegisteredUser(userId)
            .catch(() => {
                throw new NotFoundError(`WhatsApp If (${userId}) not Found`)
            })
        return isRegistered
    }
}
