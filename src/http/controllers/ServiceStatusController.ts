import { IWhatsapp } from './../../Libs/Whatsapp'
import { Request, Response, NextFunction as Next } from 'express'

export const getStatus = (request: Request, response: Response, next: Next) =>
    async ({ whatsapp }: { whatsapp: IWhatsapp }) =>
        await whatsapp.getClient().getState()
            .then((state) => response.status(200).json({ status: state === null ? 'INITIALIZING' : state }))
