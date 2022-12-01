import { IDisplayNameUpdater } from './../../Services/Me/DisplayNameUpdater'
import { IStatusSender } from './../../Services/Me/StatusSender'
import { Request, Response, NextFunction as Next } from 'express'
import DisplayNameValidator from '../validators/DisplayNameValidator'
import TextStatusValidator from '../validators/TextStatusValidator'
import { ITextStatusUpdater } from './../../Services/Me/TextStatusUpdater'

export const sendAvailableStatus = (request: Request, response: Response, next: Next) =>
    async ({ meStatusSender }: { meStatusSender: IStatusSender }) =>
        await meStatusSender.available()
            .then(() => response.status(204).send(), next)

export const sendUnavailableStatus = (request: Request, response: Response, next: Next) =>
    async ({ meStatusSender }: { meStatusSender: IStatusSender }) =>
        await meStatusSender.unavailable()
            .then(() => response.status(204).send(), next)

export const updateDisplayName = (request: Request, response: Response, next: Next) =>
    async ({ meDisplayNameUpdater }: { meDisplayNameUpdater: IDisplayNameUpdater }) =>
        await DisplayNameValidator(request, response)
            .then(async () => await meDisplayNameUpdater.update(request.body.name))
            .then(() => response.status(204).send(), next)

export const updateTextStatus = (request: Request, response: Response, next: Next) =>
    async ({ meTextStatusUpdater }: { meTextStatusUpdater: ITextStatusUpdater }) =>
        await TextStatusValidator(request, response)
            .then(async () => await meTextStatusUpdater.update(request.body.status))
            .then(() => response.status(204).send(), next)
