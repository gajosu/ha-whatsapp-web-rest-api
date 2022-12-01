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

export const index = (request: Request, response: Response, next: Next) =>
    async ({ messageGetter }: { messageGetter: IMessageGetter }) =>
        await messageGetter.all(request.params.id)
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

            if (url !== undefined) {
                message = await mediaUrlMessageCreator.create(chat, url)
            } else {
                message = await textMessageCreator.create(chat, msg)
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
            .then(async () => await messageReact.react(request.params.id, request.params.messageId, request.body.reaction))
            .then(() => response.status(204).send(), next)

export const unreact = (request: Request, response: Response, next: Next) =>
    async ({ messageReact }: { messageReact: IMessageReact }) =>
        await messageReact.react(request.params.id, request.params.messageId, '')
            .then(() => response.status(204).send(), next)

export const destroy = (request: Request, response: Response, next: Next) =>
    async ({ messageDeleter }: { messageDeleter: IMessageDeleter }) =>
        await messageDeleter.delete(request.params.id, request.params.messageId)
            .then(() => response.status(204).send(), next)
