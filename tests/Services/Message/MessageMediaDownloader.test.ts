import MessageMediaDownloader from '../../../src/Services/Message/MessageMediaDownloader'
import { mockMessageFinder, mockMessage } from '../../stubs/services/Message/MessageFinder'
import logger from '../../stubs/Logger'
import { MessageMedia } from 'whatsapp-web.js'

describe('message media downloader', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('download a media message', async () => {
        const messageMedia = new MessageMedia(
            'image/jpeg',
            'base64',
            'filename'
        )

        mockMessage.hasMedia = true
        mockMessage.downloadMedia = jest.fn().mockResolvedValue(
            messageMedia
        )
        mockMessageFinder.find.mockResolvedValue(mockMessage)

        const service = new MessageMediaDownloader(mockMessageFinder, logger)
        const media = await service.download('chatId', 'messageId')

        expect(mockMessageFinder.find).toBeCalledWith('chatId', 'messageId')
        expect(logger.debug).toBeCalledWith('Downloaded media from message messageId')
        expect(media).toEqual(messageMedia)
    })
})
