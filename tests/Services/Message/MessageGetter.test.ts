import MessageGetter from '../../../src/Services/Message/MessageGetter'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('get all messages', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('react a message with default limit', async () => {
        mockFinder.find.mockResolvedValue(mockChat)
        mockChat.fetchMessages.mockResolvedValue([mockChat])

        const service = new MessageGetter(mockFinder)
        const messages = await service.all('chatId')

        expect(mockFinder.find).toBeCalledWith('chatId')
        expect(mockChat.fetchMessages).toBeCalledWith({ limit: 100 })
        expect(messages).toEqual([mockChat])
    })

    it('react a message with custom limit', async () => {
        mockFinder.find.mockResolvedValue(mockChat)
        mockChat.fetchMessages.mockResolvedValue([mockChat])

        const service = new MessageGetter(mockFinder)
        const messages = await service.all('chatId', 50)

        expect(mockFinder.find).toBeCalledWith('chatId')
        expect(mockChat.fetchMessages).toBeCalledWith({ limit: 50 })
        expect(messages).toEqual([mockChat])
    })
})
