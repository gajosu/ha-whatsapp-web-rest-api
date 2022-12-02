import { mockWhatsappClient, mockMessageMedia } from '../../stubs/WhatsappClient'
import { mockWhatsapp } from '../../stubs/Whatsapp'

import MediaUrlMessageCreator from '../../../src/Services/Message/MediaUrlMessageCreator'

describe('Text message creator test', () => {
    it('create text message', async () => {
        const creator = new MediaUrlMessageCreator(mockWhatsapp)
        await creator.create('123456789', 'https://www.google.com')

        expect(mockMessageMedia.fromUrl).toBeCalledWith('https://www.google.com', { unsafeMime: true })
        expect(mockWhatsappClient.sendMessage).toBeCalledWith('123456789', true, undefined)
    })
})
