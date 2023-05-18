import { IGroupParticipant } from './../../Services/GroupChat/GroupParticipant'
import { IGroupChatFinder } from './../../Services/GroupChat/GroupChatFinder'
import { IGroupChatUpdater } from './../../Services/GroupChat/GroupChatUpdater'
import { IGroupChatCreator } from './../../Services/GroupChat/GroupChatCreator'
import { Request, Response, NextFunction as Next } from 'express'
import GroupChatCreatorValidator from '../validators/GroupChatCreatorValidator'
import GroupChatUpdaterValidator from '../validators/GroupChatUpdaterValidator'
import ParticipantsValidator from '../validators/ParticipantsValidator'
import { IGroupChatInvite } from './../../Services/GroupChat/GroupChatInvite'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ groupChatCreator }: { groupChatCreator: IGroupChatCreator }) =>
        await GroupChatCreatorValidator(request, response)
            .then(async () => await groupChatCreator.create(request.body.name, request.body.participants))
            .then((group) => response.status(201).json(group), next)

export const show = (request: Request, response: Response, next: Next) =>
    async ({ groupChatFinder }: { groupChatFinder: IGroupChatFinder }) =>
        await groupChatFinder.find(request.params.id)
            .then((group) => response.status(200).json(group), next)

export const update = (request: Request, response: Response, next: Next) =>
    async ({ groupChatUpdater }: { groupChatUpdater: IGroupChatUpdater }) =>
        await GroupChatUpdaterValidator(request, response)
            .then(async () => { await groupChatUpdater.update(request.params.id, request.body.name, request.body.description) })
            .then(() => response.status(204).send(), next)

export const getInvitationCode = (request: Request, response: Response, next: Next) =>
    async ({ groupChatInvite }: { groupChatInvite: IGroupChatInvite }) =>
        await groupChatInvite.getCode(request.params.id)
            .then((code) => response.status(200).send({ code, url: 'https://chat.whatsapp.com/' + code }), next)

export const revokeInvitationCode = (request: Request, response: Response, next: Next) =>
    async ({ groupChatInvite }: { groupChatInvite: IGroupChatInvite }) =>
        await groupChatInvite.revokeCode(request.params.id)
            .then(() => response.status(204).send(), next)

export const acceptInvitationCode = (request: Request, response: Response, next: Next) =>
    async ({ groupChatInvite }: { groupChatInvite: IGroupChatInvite }) =>
        await groupChatInvite.acceptInvite(request.params.inviteCode)
            .then((groupId) => response.status(200).send({ groupId }), next)

export const leave = (request: Request, response: Response, next: Next) =>
    async ({ groupChatInvite }: { groupChatInvite: IGroupChatInvite }) =>
        await groupChatInvite.leave(request.params.id)
            .then(() => response.status(204).send(), next)

export const addParticipants = (request: Request, response: Response, next: Next) =>
    async ({ groupChatParticipant }: { groupChatParticipant: IGroupParticipant }) =>
        await ParticipantsValidator(request, response)
            .then(async () => { await groupChatParticipant.add(request.params.id, request.body.participants) })
            .then(() => response.status(204).send(), next)

export const removeParticipants = (request: Request, response: Response, next: Next) =>
    async ({ groupChatParticipant }: { groupChatParticipant: IGroupParticipant }) =>
        await ParticipantsValidator(request, response)
            .then(async () => { await groupChatParticipant.remove(request.params.id, request.body.participants) })
            .then(() => response.status(204).send(), next)

export const promoteParticipants = (request: Request, response: Response, next: Next) =>
    async ({ groupChatParticipant }: { groupChatParticipant: IGroupParticipant }) =>
        await ParticipantsValidator(request, response)
            .then(async () => { await groupChatParticipant.promote(request.params.id, request.body.participants) })
            .then(() => response.status(204).send(), next)

export const demoteParticipants = (request: Request, response: Response, next: Next) =>
    async ({ groupChatParticipant }: { groupChatParticipant: IGroupParticipant }) =>
        await ParticipantsValidator(request, response)
            .then(async () => { await groupChatParticipant.demote(request.params.id, request.body.participants) })
            .then(() => response.status(204).send(), next)
