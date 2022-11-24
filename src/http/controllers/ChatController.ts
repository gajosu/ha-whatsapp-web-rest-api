import { IWhatsapp } from './../../Libs/Whatsapp'
import { Request, Response, NextFunction as Next } from 'express'

export const index = (request: Request, response: Response, next: Next) =>
    async ({ whatsapp }: { whatsapp: IWhatsapp }) => {
        try {
            const chats = await whatsapp.getClient().getChats()

            return response.json(chats)
        } catch (err) {
            next(err)
        }
    }

export const deleteChat = (request: Request, response: Response, next: Next) =>
    async ({ whatsapp }: { whatsapp: IWhatsapp }) => {
        try {
            const { id } = request.params

            await whatsapp.getClient().deleteChat(id)

            return response.json({ message: 'Chat deleted' })
        } catch (err) {
            next(err)
        }
    }
