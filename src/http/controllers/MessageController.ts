// import { Request, Response } from 'express-serve-static-core'
import { Request, Response, NextFunction as Next } from 'express'
import { validationResult } from 'express-validator'
import { IMediaUrlMessageCreator } from '../../Services/Message/MediaUrlMessageCreator'
import { ITextMessageCreator } from '../../Services/Message/TextMessageCreator'

export const store = (request: Request, response: Response, next: Next) =>
    async ({ textMessageCreator, mediaUrlMessageCreator }: { textMessageCreator: ITextMessageCreator, mediaUrlMessageCreator: IMediaUrlMessageCreator }) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }

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