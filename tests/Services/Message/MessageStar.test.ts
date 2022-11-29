import MessageStar from '../../../src/Services/Message/MessageStar'
import { mockMessageFinder, mockMessage } from '../../stubs/services/Message/MessageFinder'

describe('messsage star service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('star a message', async () => {
        mockMessageFinder.find.mockResolvedValue(mockMessage)

        const service = new MessageStar(mockMessageFinder)
        await service.star('chatId', '1234567890')

        expect(mockMessageFinder.find).toBeCalledWith('chatId', '1234567890')
        expect(mockMessage.star).toBeCalled()
    })

    it('unstar a message', async () => {
        mockMessageFinder.find.mockResolvedValue(mockMessage)

        const service = new MessageStar(mockMessageFinder)
        await service.unstar('chatId', '1234567890')

        expect(mockMessageFinder.find).toBeCalledWith('chatId', '1234567890')
        expect(mockMessage.unstar).toBeCalled()
    })
})
