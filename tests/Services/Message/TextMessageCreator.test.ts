import TextMessageCreator from '../../../src/Services/Message/TextMessageCreator';
import Whatsapp from '../../../src/Libs/Whatsapp';


const mockSendMessage = jest.fn().mockResolvedValue(true);

// mock client
jest.mock('whatsapp-web.js', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                sendMessage: mockSendMessage,
            };
        }),
        LocalAuth: jest.fn()
    };
});

beforeEach(() => {
    mockSendMessage.mockClear();
});

describe('Text message creator test', () => {
    it('create text message', () => {
        const creator = new TextMessageCreator(new Whatsapp());
        creator.create('123456789', 'test message');

        expect(mockSendMessage).toBeCalledWith('123456789', 'test message');
    });
});