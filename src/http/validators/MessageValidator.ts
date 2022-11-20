import { Request, Response } from 'express'
import { check, body, oneOf } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await oneOf([
        check('to').isNumeric(),
        check('to').matches(/^[0-9]+@.+/)
    ]).run(request)
    await check('msg')
        .if(body('url').not().exists())
        .isString()
        .run(request)
    await check('url')
        .if(body('msg').not().exists())
        .isURL()
        .run(request)

    Validator(request, response)
}
