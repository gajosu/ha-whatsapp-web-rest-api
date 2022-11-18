// import { Request, Response } from 'express-serve-static-core'
import { IMediaUrlMessageCreator } from '../../Services/Message/MediaUrlMessageCreator'
import { ITextMessageCreator } from '../../Services/Message/TextMessageCreator'
import { Request, Response, NextFunction as Next } from 'express'
import validator from '../validators/MessageValidator'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ textMessageCreator, mediaUrlMessageCreator }: { textMessageCreator: ITextMessageCreator, mediaUrlMessageCreator: IMediaUrlMessageCreator }) => {
        await validator(request, response)

        const { to, msg, url }: { to: string, msg: string, url: string } = request.body

        const id = to + '@c.us'

        try {
            if (url !== undefined) {
                await mediaUrlMessageCreator.create(id, url)
            } else {
                await textMessageCreator.create(id, msg)
            }
        } catch (error) {
            return response.status(422).json({ error: error.message })
        }

        return response.json({ message: 'Message sent' })
    }
