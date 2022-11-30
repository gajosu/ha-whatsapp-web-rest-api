export const mockGroupChatFinder = {
    find: jest.fn()
}

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
    ],

    addParticipants: jest.fn(),
    removeParticipants: jest.fn(),
    promoteParticipants: jest.fn(),
    demoteParticipants: jest.fn(),
    setSubject: jest.fn(),
    setDescription: jest.fn(),
    setMessagesAdminsOnly: jest.fn(),
    setInfoAdminsOnly: jest.fn(),
    getInviteCode: jest.fn(),
    revokeInvite: jest.fn(),
    leave: jest.fn()
}

jest.mock('../../../../src/Services/GroupChat/GroupChatFinder', () => {
    return mockGroupChat
})
