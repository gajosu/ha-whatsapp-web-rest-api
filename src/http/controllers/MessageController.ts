// import { Request, Response } from 'express-serve-static-core'
import { IMediaUrlMessageCreator } from '../../Services/Message/MediaUrlMessageCreator'
import { ITextMessageCreator } from '../../Services/Message/TextMessageCreator'
import { Request, Response, NextFunction as Next } from 'express'
import validator from '../validators/MessageValidator'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ textMessageCreator, mediaUrlMessageCreator }: { textMessageCreator: ITextMessageCreator, mediaUrlMessageCreator: IMediaUrlMessageCreator }) => {
        await validator(request)

        const { to, msg, url } = request.body

        try {
            if (url !== undefined) {
                await mediaUrlMessageCreator.create(to, url)
            } else {
                await textMessageCreator.create(to, msg)
            }
        } catch (error) {
            return response.status(422).json({ error: error.message })
        }

        return response.json({ message: 'Message sent' })
    }
