export const mockMessageFinder = {
    find: jest.fn()
}

const messageAttr = {
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
    hasMedia: false
}

export const mockMessage = {
    ...messageAttr,
    star: jest.fn(),
    unstar: jest.fn(),
    react: jest.fn(),
    delete: jest.fn(),
    downloadMedia: jest.fn(),
    rawData: messageAttr
}

jest.mock('../../../../src/Services/Message/MessageFinder', () => {
    return jest.fn().mockImplementation(() => {
        return mockMessageFinder
    })
})
