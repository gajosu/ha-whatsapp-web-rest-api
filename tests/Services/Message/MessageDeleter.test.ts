import MessageDeleter from '../../../src/Services/Message/MessageDeleter'
import { mockMessageFinder, mockMessage } from '../../stubs/services/Message/MessageFinder'

describe('messsage star service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('delete a message', async () => {
        mockMessageFinder.find.mockResolvedValue(mockMessage)

        const service = new MessageDeleter(mockMessageFinder)
        await service.delete('chatId', '1234567890')

        expect(mockMessageFinder.find).toBeCalledWith('chatId', '1234567890')
        expect(mockMessage.delete).toBeCalledWith(true)
    })
})
