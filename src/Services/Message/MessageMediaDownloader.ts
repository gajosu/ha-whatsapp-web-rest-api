import { MessageMedia } from 'whatsapp-web.js'
import { IMessageFinder } from './MessageFinder'
import { ValidationError } from '../../../src/Exceptions/ValidationError'
import { ILogger } from '../../../src/Libs/Logger'

export interface IMessageMediaDownloader {
    download: (chatId: string, messageId: string) => Promise<MessageMedia>
}

export default class MessageMediaDownloader implements IMessageMediaDownloader {
    public constructor (
        private readonly messageFinder: IMessageFinder,
        private readonly logger: ILogger
    ) {}

    public async download (chatId: string, messageId: string): Promise<MessageMedia> {
        const message = await this.messageFinder.find(chatId, messageId)

        if (!message.hasMedia) {
            throw new ValidationError(['Message does not have media'])
        }

        const media = await message.downloadMedia()

        this.logger.debug(`Downloaded media from message ${messageId}`)

        return media
    }
}
