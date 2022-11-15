// mock resolve a promise
const mockInitialize = jest.fn().mockResolvedValue(true);
const mockOn = jest.fn();
const mockDestroy = jest.fn();
const mockSendMessage = jest.fn().mockResolvedValue(true);

export const mockWhatsappClient = {
    initialize: mockInitialize,
    on: mockOn,
    destroy: mockDestroy,
    sendMessage: mockSendMessage
};

export const mockMessageMedia = {
    fromUrl: jest.fn().mockReturnValue(true)
};


jest.mock('whatsapp-web.js', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return;
        }),
        LocalAuth: jest.fn(),
        MessageMedia: mockMessageMedia
    };
});