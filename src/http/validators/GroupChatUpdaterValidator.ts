import { Request, Response } from 'express'
import { check } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await check('name')
        .isString()
        .run(request)

    await check('description')
        .isString()
        .optional()
        .run(request)

    Validator(request, response)
}
