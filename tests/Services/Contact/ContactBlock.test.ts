
import { mockContact, mockContactFinder } from '../../stubs/services/Contact/ContactFinder'
import ContactBlock from '../../../src/Services/Contact/ContactBlock'

describe('contact block service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('block a contact', async () => {
        mockContactFinder.find.mockResolvedValue(mockContact)

        const service = new ContactBlock(mockContactFinder)
        await service.block('123')

        expect(mockContactFinder.find).toBeCalledWith('123')
        expect(mockContact.block).toBeCalled()
    })

    it('unblock a contact', async () => {
        mockContactFinder.find.mockResolvedValue(mockContact)

        const service = new ContactBlock(mockContactFinder)
        await service.unblock('123')

        expect(mockContactFinder.find).toBeCalledWith('123')
        expect(mockContact.unblock).toBeCalled()
    })
})
