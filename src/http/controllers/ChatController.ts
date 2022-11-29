import { IChatGetter } from './../../Services/Chat/ChatGetter'
import { Request, Response, NextFunction as Next } from 'express'
import { IChatDeleter } from '../../Services/Chat/ChatDeleter'
import { IChatArchive } from '../../Services/Chat/ChatArchive'
import { IChatPin } from '../../Services/Chat/ChatPin'
import { IChatReader } from '../../Services/Chat/ChatReader'
import { IChatStateSender } from '../../Services/Chat/ChatStateSender'

export const index = (request: Request, response: Response, next: Next) =>
    async ({ chatGetter }: { chatGetter: IChatGetter }) =>
        await chatGetter.all()
            .then(chats => response.json(chats), next)

export const archiveChat = (request: Request, response: Response, next: Next) =>
    async ({ chatArchive }: { chatArchive: IChatArchive }) =>
        await chatArchive.archive(request.params.id)
            .then(() => response.status(204).send(), next)

export const unarchiveChat = (request: Request, response: Response, next: Next) =>
    async ({ chatArchive }: { chatArchive: IChatArchive }) =>
        await chatArchive.unarchive(request.params.id)
            .then(() => response.status(204).send(), next)

export const pinChat = (request: Request, response: Response, next: Next) =>
    async ({ chatPin }: { chatPin: IChatPin }) =>
        await chatPin.pin(request.params.id)
            .then(() => response.status(204).send(), next)

export const unpinChat = (request: Request, response: Response, next: Next) =>
    async ({ chatPin }: { chatPin: IChatPin }) =>
        await chatPin.unpin(request.params.id)
            .then(() => response.status(204).send(), next)

export const markChatAsRead = (request: Request, response: Response, next: Next) =>
    async ({ chatReader }: { chatReader: IChatReader }) =>
        await chatReader.read(request.params.id)
            .then(() => response.status(204).send(), next)

export const markChatAsUnread = (request: Request, response: Response, next: Next) =>
    async ({ chatReader }: { chatReader: IChatReader }) =>
        await chatReader.unread(request.params.id)
            .then(() => response.status(204).send(), next)

export const sendTypingState = (request: Request, response: Response, next: Next) =>
    async ({ chatStateSender }: { chatStateSender: IChatStateSender }) =>
        await chatStateSender.typing(request.params.id)
            .then(() => response.status(204).send(), next)

export const sendRecordingState = (request: Request, response: Response, next: Next) =>
    async ({ chatStateSender }: { chatStateSender: IChatStateSender }) =>
        await chatStateSender.recording(request.params.id)
            .then(() => response.status(204).send(), next)

export const sendClearState = (request: Request, response: Response, next: Next) =>
    async ({ chatStateSender }: { chatStateSender: IChatStateSender }) =>
        await chatStateSender.clear(request.params.id)
            .then(() => response.status(204).send(), next)

export const deleteChat = (request: Request, response: Response, next: Next) =>
    async ({ chatDeleter }: { chatDeleter: IChatDeleter }) =>
        await chatDeleter.delete(request.params.id)
            .then(() => response.status(204).send(), next)
