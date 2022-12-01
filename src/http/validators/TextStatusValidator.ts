import { Request, Response } from 'express'
import { check } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await check('status')
        .isString()
        .run(request)

    Validator(request, response)
}
