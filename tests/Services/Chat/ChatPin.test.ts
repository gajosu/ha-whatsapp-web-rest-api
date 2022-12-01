import ChatPin from '../../../src/Services/Chat/ChatPin'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('pin a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatPin(mockFinder)
        await service.pin('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.pin).toBeCalled()
    })

    it('unpin a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatPin(mockFinder)
        await service.unpin('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.unpin).toBeCalled()
    })
})
