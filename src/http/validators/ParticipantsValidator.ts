import { Request, Response } from 'express'
import { check } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await check('participants')
        .isArray()
        .custom((participants: string[]) => participants.every(participant => participant.match(/^[0-9]+@c.us$/)))
        .run(request)

    Validator(request, response)
}
