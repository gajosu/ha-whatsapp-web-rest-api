
import { mockWhatsappClient } from '../../stubs/WhatsappClient';
import { mockWhatsapp } from '../../stubs/Whatsapp';
import TextMessageCreator from '../../../src/Services/Message/TextMessageCreator';

afterEach(() => {
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Text message creator test', () => {
    it('create text message', () => {
        const creator = new TextMessageCreator(mockWhatsapp);
        creator.create('123456789', 'test message');

        expect(mockWhatsappClient.sendMessage).toBeCalledWith('123456789', 'test message');
    });
});