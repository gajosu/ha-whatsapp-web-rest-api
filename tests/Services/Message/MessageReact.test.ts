import MessageReact from '../../../src/Services/Message/MessageReact'
import { mockMessageFinder, mockMessage } from '../../stubs/services/Message/MessageFinder'

describe('messsage star service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('react a message', async () => {
        mockMessageFinder.find.mockResolvedValue(mockMessage)

        const service = new MessageReact(mockMessageFinder)
        await service.react('chatId', '1234567890', '👍')

        expect(mockMessageFinder.find).toBeCalledWith('chatId', '1234567890')
        expect(mockMessage.react).toBeCalled()
    })
})
