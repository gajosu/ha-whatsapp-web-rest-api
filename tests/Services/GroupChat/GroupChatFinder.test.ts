import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import GroupChatFinder from '../../../src/Services/GroupChat/GroupChatFinder'

export const mockGroupChat = {
    id: {
        server: 'c.us',
        user: '554199999999',
        _serialized: '554199999999@c.us'
    },
    archived: false,
    isGroup: true,
    isReadOnly: false,
    isMuted: false,
    muteExpiration: 0,
    name: 'Test',
    timestamp: 0,
    unreadCount: 0,
    owner: '554199999999',
    createdAt: 0,
    description: 'Test',
    participants: [
        {
            id: {
                server: 'c.us',
                user: '554199',
                _serialized: '554199@c.us'
            },
            isAdmin: false,
            isSuperAdmin: false
        }
    ]
}

describe('Group chat finder service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('find a group chat', async () => {
        mockWhatsappClient.getChatById.mockResolvedValue(mockGroupChat)
        const finder = new GroupChatFinder(mockWhatsapp)
        const chat = await finder.find('123')

        expect(mockWhatsappClient.getChatById).toBeCalledWith('123')
        expect(chat).toEqual(mockGroupChat)
    })

    it('group chat is not a group', async () => {
        const chat = { ...mockGroupChat, isGroup: false }

        mockWhatsappClient.getChatById.mockResolvedValue(chat)
        const finder = new GroupChatFinder(mockWhatsapp)

        await expect(finder.find('123')).rejects.toThrowError('The Group Chat (123) is not found.')
    })
})
