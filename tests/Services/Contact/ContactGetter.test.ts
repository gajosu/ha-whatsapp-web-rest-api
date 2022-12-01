
import { mockWhatsapp } from './../../stubs/Whatsapp'
import { mockContact } from '../../stubs/services/Contact/ContactFinder'
import ContactGetter from '../../../src/Services/Contact/ContactGetter'

describe('contact getter service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get all contacts', async () => {
        mockWhatsapp.getClient().getContacts.mockResolvedValue([mockContact])

        const service = new ContactGetter(mockWhatsapp)
        const contacts = await service.all()

        expect(contacts).toEqual([mockContact])
    })
})
