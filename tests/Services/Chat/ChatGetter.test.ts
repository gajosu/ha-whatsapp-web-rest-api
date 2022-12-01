import { mockChat } from '../../stubs/services/Chat/ChatFinder'
import { mockWhatsapp } from './../../stubs/Whatsapp'
import { mockWhatsappClient } from './../../stubs/WhatsappClient'
import ChatGetter from '../../../src/Services/Chat/ChatGetter'

describe('chat archive service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get all chats', async () => {
        mockWhatsappClient.getChats.mockResolvedValue([
            mockChat
        ])

        const service = new ChatGetter(mockWhatsapp)
        const chats = await service.all()

        expect(chats).toEqual([mockChat])
    })
})
