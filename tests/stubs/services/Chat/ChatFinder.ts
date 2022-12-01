export const mockFinder = {
    find: jest.fn()
}

export const mockChat = {
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
    unreadCount: 0,

    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn(),
    clearMessages: jest.fn(),
    mute: jest.fn(),
    unmute: jest.fn(),
    pin: jest.fn(),
    unpin: jest.fn(),
    sendSeen: jest.fn(),
    markUnread: jest.fn(),
    sendStateTyping: jest.fn(),
    sendStateRecording: jest.fn(),
    clearState: jest.fn(),
    fetchMessages: jest.fn()
}

jest.mock('../../../../src/Services/Chat/ChatFinder', () => {
    return mockFinder
})
