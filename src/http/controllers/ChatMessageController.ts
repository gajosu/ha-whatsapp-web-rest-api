import { IMessageReact } from './../../Services/Message/MessageReact'
import { IMessageStar } from './../../Services/Message/MessageStar'
import { IMessageDeleter } from './../../Services/Message/MessageDeleter'
import { IMessageGetter } from './../../Services/Message/MessageGetter'
import ChatMessageValidator from '../../http/validators/MessageReactValidator'

import { Request, Response, NextFunction as Next } from 'express'

export const index = (request: Request, response: Response, next: Next) =>
    async ({ messageGetter }: { messageGetter: IMessageGetter }) =>
        await messageGetter.all(request.params.id)
            .then(messages => response.json(messages), next)

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
            .then(async () => await messageReact.react(request.params.id, request.params.messageId, request.body.reaction ?? ''))
            .then(() => response.status(204).send(), next)

export const destroy = (request: Request, response: Response, next: Next) =>
    async ({ messageDeleter }: { messageDeleter: IMessageDeleter }) =>
        await messageDeleter.delete(request.params.id, request.params.messageId)
            .then(() => response.status(204).send(), next)
