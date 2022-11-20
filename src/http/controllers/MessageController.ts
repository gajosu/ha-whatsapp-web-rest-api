// import { Request, Response } from 'express-serve-static-core'
import { IMediaUrlMessageCreator } from '../../Services/Message/MediaUrlMessageCreator'
import { ITextMessageCreator } from '../../Services/Message/TextMessageCreator'
import { Request, Response, NextFunction as Next } from 'express'
import validator from '../validators/MessageValidator'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ textMessageCreator, mediaUrlMessageCreator }: { textMessageCreator: ITextMessageCreator, mediaUrlMessageCreator: IMediaUrlMessageCreator }) => {
        try {
            await validator(request, response)

            const { msg, url }: { msg: string, url: string } = request.body
            let { to }: { to: string } = request.body

            if (!to.includes('@')) {
                to = to + '@c.us'
            }

            if (url !== undefined) {
                await mediaUrlMessageCreator.create(to, url)
            } else {
                await textMessageCreator.create(to, msg)
            }

            return response.json({ message: 'Message sent' })
        } catch (err) {
            next(err)
        }
    }
