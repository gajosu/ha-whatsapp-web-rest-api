import { Request } from 'express'
import { validationResult, check, body } from 'express-validator'

export default async function (request: Request): Promise<void> {
    await check('to').isString().run(request)
    await check('msg')
        .if(body('url').not().exists())
        .isString()
        .run(request)
    await check('url')
        .if(body('msg').not().exists())
        .isURL()
        .run(request)

    validationResult(request).throw()
}
