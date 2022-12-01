import ChatMute from '../../../src/Services/Chat/ChatMute'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('mute a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatMute(mockFinder)
        await service.mute('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.mute).toBeCalled()
    })

    it('unmute a chat', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatMute(mockFinder)
        await service.unmute('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.unmute).toBeCalled()
    })
})
