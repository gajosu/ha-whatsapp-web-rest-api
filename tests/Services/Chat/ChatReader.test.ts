import ChatReader from '../../../src/Services/Chat/ChatReader'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('mark a chat as read', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatReader(mockFinder)
        await service.read('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.sendSeen).toBeCalled()
    })

    it('mark a chat as unread', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatReader(mockFinder)
        await service.unread('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.markUnread).toBeCalled()
    })
})
