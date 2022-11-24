import ChatStateSender from '../../../src/Services/Chat/ChatStateSender'
import { mockFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('send typing state', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatStateSender(mockFinder)
        await service.typing('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.sendStateTyping).toBeCalled()
    })

    it('send recording state', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatStateSender(mockFinder)
        await service.recording('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.sendStateRecording).toBeCalled()
    })

    it('clear state', async () => {
        mockFinder.find.mockResolvedValue(mockChat)

        const service = new ChatStateSender(mockFinder)
        await service.clear('123')

        expect(mockFinder.find).toBeCalledWith('123')
        expect(mockChat.clearState).toBeCalled()
    })
})
