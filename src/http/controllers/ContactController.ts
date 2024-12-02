import { IContactBlock } from './../../Services/Contact/ContactBlock'
import { IContactFinder } from './../../Services/Contact/ContactFinder'
import { IContactGetter } from './../../Services/Contact/ContactGetter'
import { INumberValidator } from './../../Services/Contact/NumberValidator'
import { Request, Response, NextFunction as Next } from 'express'

export const index = (request: Request, response: Response, next: Next) =>
    async ({ contactGetter }: { contactGetter: IContactGetter }) =>
        await contactGetter.all()
            .then(contacts => response.status(200).json(contacts).send(), next)

export const show = (request: Request, response: Response, next: Next) =>
    async ({ contactFinder }: { contactFinder: IContactFinder }) =>
        await contactFinder.find(request.params.id)
            .then(contact => response.status(200).json(contact).send(), next)

export const block = (request: Request, response: Response, next: Next) =>
    async ({ contactBlock }: { contactBlock: IContactBlock }) =>
        await contactBlock.block(request.params.id)
            .then(() => response.status(204).send(), next)

export const unblock = (request: Request, response: Response, next: Next) =>
    async ({ contactBlock }: { contactBlock: IContactBlock }) =>
        await contactBlock.unblock(request.params.id)
            .then(() => response.status(204).send(), next)

export const commonGroups = (request: Request, response: Response, next: Next) =>
    async ({ contactFinder }: { contactFinder: IContactFinder }) =>
        await contactFinder.find(request.params.id)
            .then(async contact => await contact.getCommonGroups())
            .then(groups => response.status(200).json(groups).send(), next)

export const isRegisteredUser = (request: Request, response: Response, next: Next) =>
    async ({ numberValidator }: { numberValidator: INumberValidator }) =>
        await numberValidator.validate(request.params.id)
            .then((result) => response.status(200).json({ isRegistered: result }).send(), next)
