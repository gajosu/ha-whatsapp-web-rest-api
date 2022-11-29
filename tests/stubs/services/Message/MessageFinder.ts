export const mockMessageFinder = {
    find: jest.fn()
}

export const mockMessage = {
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
    star: jest.fn(),
    unstar: jest.fn(),
    react: jest.fn(),
    delete: jest.fn()
}

jest.mock('../../../../src/Services/Message/MessageFinder', () => {
    return mockMessageFinder
})
