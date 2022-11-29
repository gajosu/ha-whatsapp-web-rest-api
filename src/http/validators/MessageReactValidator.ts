import { Request, Response } from 'express'
import { check, oneOf } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await check('reaction')
        .matches(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)
        .optional()
        .run(request)

    Validator(request, response)
}
