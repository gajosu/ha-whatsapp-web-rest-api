import { NotFoundError } from './../../../src/Exceptions/NotFoundError'
import { mockFinder as mockChatFinder, mockChat } from '../../stubs/services/Chat/ChatFinder'
import MessageFinder from '../../../src/Services/Message/MessageFinder'

const mockMessage = {
    id: {
        id: '1234567890',
        fromMe: true,
        remote: '',
        _serialized: ''
    },
    fromMe: true,
    to: '',
    body: 'Test',
    type: 'chat',
    isGroupMsg: false,
    isMedia: false,
    isNotification: false,
    isPSA: false,
    isStarred: false,
    isStatus: false,
    isEphemeral: false,
    chat: mockChat
}

mockChatFinder.find.mockResolvedValue(mockChat)

describe('Message finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('find a message', async () => {
        mockChat.fetchMessages.mockResolvedValue([mockMessage])

        const finder = new MessageFinder(mockChatFinder)
        const message = await finder.find('chatId', mockMessage.id.id)

        expect(message).toBeDefined()
        expect(mockChat.fetchMessages).toBeCalledTimes(1)
        expect(mockChat.fetchMessages).toBeCalledWith({ limit: Infinity })
        expect(message).toEqual(mockMessage)
    })

    it('message not found', async () => {
        mockChat.fetchMessages.mockResolvedValue([])

        const finder = new MessageFinder(mockChatFinder)

        await expect(finder.find('chatId', mockMessage.id.id)).rejects.toThrow(NotFoundError)
    })
})
