import ChatDeleter from '../../../src/Services/Chat/ChatDeleter'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('delete a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatDeleter(mockFinder)
        await service.delete('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.delete).toBeCalled()
    })
})
