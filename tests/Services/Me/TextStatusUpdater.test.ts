import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import TextStatusUpdater from '../../../src/Services/Me/TextStatusUpdater'

describe('Group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Update text status', async () => {
        mockWhatsappClient.setDisplayName.mockResolvedValue(true)
        const updater = new TextStatusUpdater(mockWhatsapp)
        await updater.update('Test')
        expect(mockWhatsappClient.setStatus).toBeCalledWith('Test')
    })
})
