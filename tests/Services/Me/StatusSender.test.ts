import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import StatusSender from '../../../src/Services/Me/StatusSender'

describe('Group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('sender status available', async () => {
        const sender = new StatusSender(mockWhatsapp)
        await sender.available()
        expect(mockWhatsappClient.sendPresenceAvailable).toBeCalled()
    })

    it('sender status unavailable', async () => {
        const sender = new StatusSender(mockWhatsapp)
        await sender.unavailable()
        expect(mockWhatsappClient.sendPresenceUnavailable).toBeCalled()
    })
})
