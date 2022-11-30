import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import ContactFinder from '../../../src/Services/Contact/ContactFinder'

export const mockContact = {
    number: '123456789',
    isBusiness: false,
    id: {
        server: 'server',
        user: 'user',
        _serialized: 'user@server'
    },
    isEnterprise: false,
    isGroup: false,
    isMe: false,
    isMyContact: false,
    isUser: true,
    isWAContact: true,
    isBlocked: false,
    labels: [],
    name: 'name',
    pushname: 'pushname',
    sectionHeader: 'sectionHeader',
    shortName: 'shortName',
    statusMute: true,
    type: 'type'
}

describe('Group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should find a contact', async () => {
        const contactFinder = new ContactFinder(mockWhatsapp)

        mockWhatsappClient.getContactById.mockResolvedValue(mockContact)

        const result = await contactFinder.find(mockContact.id._serialized)

        expect(mockWhatsappClient.getContactById).toBeCalledWith(mockContact.id._serialized)
        expect(result).toEqual(mockContact)
    })

    it('should throw an error if contact not found', async () => {
        const contactFinder = new ContactFinder(mockWhatsapp)

        mockWhatsappClient.getContactById.mockRejectedValue(new Error('Contact not found'))

        await expect(contactFinder.find(mockContact.id._serialized)).rejects.toThrow('The Contact (user@server) is not found.')
    })
})
