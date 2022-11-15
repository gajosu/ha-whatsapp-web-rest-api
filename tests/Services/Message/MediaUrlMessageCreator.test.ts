import Whatsapp from '../../../src/Libs/Whatsapp';
import MediaUrlMessageCreator from '../../../src/Services/Message/MediaUrlMessageCreator';
import { MessageMedia } from 'whatsapp-web.js';


const mockSendMessage = jest.fn().mockResolvedValue(true);

// mock client
jest.mock('whatsapp-web.js', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                sendMessage: mockSendMessage,
            };
        }),
        MessageMedia: 
            {
                fromUrl: jest.fn().mockResolvedValue(true),
            }
        ,
        LocalAuth: jest.fn(),
        
    };
});

describe('Text message creator test', () => {
    it('create text message', async () => {

        const creator = new MediaUrlMessageCreator(new Whatsapp());
        await creator.create('123456789', 'https://www.google.com');

        expect(MessageMedia.fromUrl).toBeCalledWith('https://www.google.com', { unsafeMime: true });
        expect(mockSendMessage).toBeCalledWith('123456789', true);
    });
});