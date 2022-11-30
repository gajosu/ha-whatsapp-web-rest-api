import { IGroupChatUpdater } from './../../Services/GroupChat/GroupChatUpdater'
import { IGroupChatCreator } from './../../Services/GroupChat/GroupChatCreator'
import { Request, Response, NextFunction as Next } from 'express'
import GroupChatCreatorValidator from '../validators/GroupChatCreatorValidator'
import GroupChatUpdaterValidator from '../validators/GroupChatUpdaterValidator'
import { IGroupChatInvite } from './../../Services/GroupChat/GroupChatInvite'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ groupChatCreator }: { groupChatCreator: IGroupChatCreator }) =>
        await GroupChatCreatorValidator(request, response)
            .then(async () => await groupChatCreator.create(request.body.name, request.body.participants))
            .then((group) => response.status(201).send(group), next)

export const update = (request: Request, response: Response, next: Next) =>
    async ({ groupChatUpdater }: { groupChatUpdater: IGroupChatUpdater }) =>
        await GroupChatUpdaterValidator(request, response)
            .then(async () => await groupChatUpdater.update(request.params.id, request.body.name, request.body.description))
            .then(() => response.status(204).send(), next)

export const getInvitationCode = (request: Request, response: Response, next: Next) =>
    async ({ groupChatInvite }: { groupChatInvite: IGroupChatInvite }) =>
        await groupChatInvite.getCode(request.params.id)
            .then((code) => response.status(200).send({ code, url: 'https://chat.whatsapp.com/' + code }), next)
