import ChatArchive from '../../../src/Services/Chat/ChatArchive'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('archive a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatArchive(mockFinder)
        await service.archive('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.archive).toBeCalled()
    })

    it('unarchive a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatArchive(mockFinder)
        await service.unarchive('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.unarchive).toBeCalled()
    })
})
