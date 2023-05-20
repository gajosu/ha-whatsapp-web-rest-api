import { IMessageReact } from './../../Services/Message/MessageReact'
import { IMessageStar } from './../../Services/Message/MessageStar'
import { IMessageDeleter } from './../../Services/Message/MessageDeleter'
import { IMessageGetter } from './../../Services/Message/MessageGetter'
import ChatMessageValidator from '../../http/validators/MessageReactValidator'
import MessageValidator from '../validators/MessageValidator'

import { Request, Response, NextFunction as Next } from 'express'
import { ITextMessageCreator } from './../../Services/Message/TextMessageCreator'
import { IMediaUrlMessageCreator } from './../../Services/Message/MediaUrlMessageCreator'
import { Message } from 'whatsapp-web.js'
import { IMessageMediaDownloader } from './../../Services/Message/MessageMediaDownloader'
import { IBase64FileDownloader } from './../../Services/Response/Base64FIleDownloader'

export const index = (request: Request, response: Response, next: Next) =>
    async ({ messageGetter }: { messageGetter: IMessageGetter }) =>
        await messageGetter.all(request.params.id, request.query.limit === undefined ? undefined : Number(request.query.limit))
            .then(messages => response.json(messages), next)

export const store = (request: Request, response: Response, next: Next) =>
    async ({ textMessageCreator, mediaUrlMessageCreator }: { textMessageCreator: ITextMessageCreator, mediaUrlMessageCreator: IMediaUrlMessageCreator }) => {
        try {
            await MessageValidator(request, response)

            const { msg, url, to }: { msg: string, url: string, to: string | undefined } = request.body
            let chat: string = to ?? request.params.id
            let message: Message | null = null

            if (!chat.includes('@')) {
                chat = chat + '@c.us'
            }

            const options = {
                linkPreview: request.body.options?.linkPreview,
                sendAudioAsVoice: request.body.options?.sendAudioAsVoice,
                sendVideoAsGif: request.body.options?.sendVideoAsGif,
                sendMediaAsSticker: request.body.options?.sendMediaAsSticker,
                sendMediaAsDocument: request.body.options?.sendMediaAsDocument,
                caption: request.body.options?.caption,
                quotedMessageId: request.body.options?.quotedMessageId,
                mentions: request.body.options?.mentions,
                sendSeen: request.body.options?.sendSeen,
                stickerName: request.body.options?.stickerName,
                stickerAuthor: request.body.options?.stickerAuthor,
                stickerCategories: request.body.options?.stickerCategories
            }

            if (url !== undefined) {
                message = await mediaUrlMessageCreator.create(chat, url, options)
            } else {
                message = await textMessageCreator.create(chat, msg, options)
            }

            return response.json(message.rawData)
        } catch (err) {
            next(err)
        }
    }

export const star = (request: Request, response: Response, next: Next) =>
    async ({ messageStar }: { messageStar: IMessageStar }) =>
        await messageStar.star(request.params.id, request.params.messageId)
            .then(() => response.status(204).send(), next)

export const unstar = (request: Request, response: Response, next: Next) =>
    async ({ messageStar }: { messageStar: IMessageStar }) =>
        await messageStar.unstar(request.params.id, request.params.messageId)
            .then(() => response.status(204).send(), next)

export const react = (request: Request, response: Response, next: Next) =>
    async ({ messageReact }: { messageReact: IMessageReact }) =>
        await ChatMessageValidator(request, response)
            .then(async () => { await messageReact.react(request.params.id, request.params.messageId, request.body.reaction) })
            .then(() => response.status(204).send(), next)

export const unreact = (request: Request, response: Response, next: Next) =>
    async ({ messageReact }: { messageReact: IMessageReact }) =>
        await messageReact.react(request.params.id, request.params.messageId, '')
            .then(() => response.status(204).send(), next)

export const downloadMedia = (request: Request, response: Response, next: Next) =>
    async ({ messageMediaDownloader, base64FileDownloader }: { messageMediaDownloader: IMessageMediaDownloader, base64FileDownloader: IBase64FileDownloader }) => {
        try {
            const messageMedia = await messageMediaDownloader.download(request.params.id, request.params.messageId)

            return await base64FileDownloader.download(
                `${request.params.id}_${request.params.messageId}`,
                messageMedia.mimetype,
                messageMedia.data,
                response
            )
        } catch (err) {
            next(err)
        }
    }

export const destroy = (request: Request, response: Response, next: Next) =>
    async ({ messageDeleter }: { messageDeleter: IMessageDeleter }) =>
        await messageDeleter.delete(request.params.id, request.params.messageId)
            .then(() => response.status(204).send(), next)
