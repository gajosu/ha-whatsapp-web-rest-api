import { CreateGroupResult } from 'whatsapp-web.js'
import { IWhatsapp } from './../../Libs/Whatsapp'
import HttpError from '../../Exceptions/HttpError'

export interface IGroupChatCreator {
    create: (name: string, participants: string[]) => Promise<CreateGroupResult>
}

export default class GroupChatCreator implements IGroupChatCreator {
    public constructor (private readonly whatsapp: IWhatsapp) {}

    public async create (name: string, participants: string[]): Promise<CreateGroupResult> {
        const client = this.whatsapp.getClient()

        await this.loadGroupCreateModule(client)

        const result = await client.createGroup(name, participants)

        // whatsapp-web.js swallows errors and returns a string like
        // "CreateGroupError: ..." instead of throwing
        if (typeof result === 'string') {
            throw new HttpError(502, result)
        }

        return result
    }

    /**
     * WhatsApp Web lazy-loads WAWebGroupCreateJob (only when the "New group"
     * screen is opened), so createGroup fails with a generic CreateGroupError
     * until the bundle is loaded.
     * See https://github.com/pedroslopez/whatsapp-web.js/issues/201920
     */
    private async loadGroupCreateModule (client: any): Promise<void> {
        if (client.pupPage === undefined || client.pupPage === null) return

        // passed as a string so the TypeScript compiler doesn't transpile the
        // async function into a helper (__awaiter) that doesn't exist in the browser
        await client.pupPage.evaluate(`(async () => {
            if (!window.require('WAWebGroupCreateJob')) {
                await window.require('WAWebNewGroupFlowLoadable').requireBundle()
            }
        })()`)
    }
}
