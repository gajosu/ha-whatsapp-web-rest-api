import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import DisplayNameUpdater from '../../../src/Services/Me/DisplayNameUpdater'


describe('Group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Update display name', async () => {
        mockWhatsappClient.setDisplayName.mockResolvedValue(true)
        const updater = new DisplayNameUpdater(mockWhatsapp)
        const chat = await updater.update('Test')

        expect(chat).toBeTruthy()
        expect(mockWhatsappClient.setDisplayName).toBeCalledWith('Test')
    })
})
