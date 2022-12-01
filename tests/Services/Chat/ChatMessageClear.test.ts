import ChatMessageClear from '../../../src/Services/Chat/ChatMessageClear'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('clear messages of a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatMessageClear(mockFinder)
        await service.clear('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.clearMessages).toBeCalled()
    })
})
