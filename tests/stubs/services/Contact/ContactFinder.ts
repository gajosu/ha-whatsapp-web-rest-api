export const mockContactFinder = {
    find: jest.fn()
}

export const mockCotact = {
    number: '123456789',
    isBusiness: false,
    id: {
        server: 'server',
        user: 'user',
        _serialized: 'user@server'
    },
    isEnterprise: false,
    isGroup: false,
    isMe: false,
    isMyContact: false,
    isUser: true,
    isWAContact: true,
    isBlocked: false,
    labels: [],
    name: 'name',
    pushname: 'pushname',
    sectionHeader: 'sectionHeader',
    shortName: 'shortName',
    statusMute: true,
    type: 'type',

    getProfilePicUrl: jest.fn(),
    getChat: jest.fn(),
    getCountryCode: jest.fn(),
    getFormattedNumber: jest.fn(),
    block: jest.fn(),
    unblock: jest.fn(),
    getAbout: jest.fn(),
    getCommonGroups: jest.fn()
}

jest.mock('../../../../src/Services/Contact/ContactFinder', () => {
    return jest.fn().mockImplementation(() => {
        return mockContactFinder
    })
})
