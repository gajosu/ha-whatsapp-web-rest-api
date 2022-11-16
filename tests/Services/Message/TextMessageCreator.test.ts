
import { mockWhatsappClient } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'
import TextMessageCreator from '../../../src/Services/Message/TextMessageCreator'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('Text message creator test', () => {
    it('create text message', async () => {
        const creator = new TextMessageCreator(mockWhatsapp)
        await creator.create('123456789', 'test message')

        expect(mockWhatsappClient.sendMessage).toBeCalledWith('123456789', 'test message')
    })
})
