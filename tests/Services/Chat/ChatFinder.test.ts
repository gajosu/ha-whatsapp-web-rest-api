import { NotFoundError } from './../../../src/Exceptions/NotFoundError'
import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import ChatFinder from '../../../src/Services/Chat/ChatFinder'

const mockChat = {
    id: {
        server: 'c.us',
        user: '554199999999',
        _serialized: '554199999999@c.us'
    },
    archived: false,
    isGroup: false,
    isReadOnly: false,
    isMuted: false,
    muteExpiration: 0,
    name: 'Test',
    timestamp: 0,
    unreadCount: 0
}

describe('chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('find a chat', async () => {
        mockWhatsappClient.getChatById.mockResolvedValue(mockChat)
        const finder = new ChatFinder(mockWhatsapp)
        const chat = await finder.find('123')

        expect(mockWhatsappClient.getChatById).toBeCalledWith('123')
        expect(chat).toEqual(mockChat)
    })

    it('chat is not found', async () => {
        mockWhatsappClient.getChatById.mockRejectedValue(new Error('Chat not found'))
        const finder = new ChatFinder(mockWhatsapp)

        await expect(finder.find('123')).rejects.toThrowError(NotFoundError)
    })
})
