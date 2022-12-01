// mock resolve a promise
const mockInitialize = jest.fn().mockResolvedValue(true)
const mockOn = jest.fn()
const mockDestroy = jest.fn()
const mockSendMessage = jest.fn().mockResolvedValue(true)

export const mockWhatsappClient = {
    initialize: mockInitialize,
    on: mockOn,
    destroy: mockDestroy,
    sendMessage: mockSendMessage,
    getChatById: jest.fn(),
    getChats: jest.fn(),
    archive: jest.fn(),
    getState: jest.fn(),
    createGroup: jest.fn(),
    acceptInvite: jest.fn(),
    getContactById: jest.fn(),
    setDisplayName: jest.fn(),
    setStatus: jest.fn(),
    sendPresenceAvailable: jest.fn(),
    sendPresenceUnavailable: jest.fn(),
    getContacts: jest.fn()
}

export const mockMessageMedia = {
    fromUrl: jest.fn().mockReturnValue(true)
}

jest.mock('whatsapp-web.js', () => {
    return {
        Client: jest.fn(),
        LocalAuth: jest.fn(),
        MessageMedia: mockMessageMedia
    }
})
