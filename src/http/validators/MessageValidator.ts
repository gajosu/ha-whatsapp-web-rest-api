import { Request, Response } from 'express'
import { check, body, oneOf } from 'express-validator'
import Validator from './Validator'

export default async function (request: Request, response: Response): Promise<void> {
    await oneOf([
        check('to').isNumeric(),
        check('to').matches(/^.+@.+/),
        check('id').isNumeric(),
        check('id').matches(/^.+@.+/)
    ]).run(request)
    await check('msg')
        .if(body('url').not().exists())
        .isString()
        .run(request)
    await check('url')
        .if(body('msg').not().exists())
        .isURL()
        .run(request)

    await body('options.linkPreview').isBoolean().optional().run(request)
    await body('options.sendAudioAsVoice').isBoolean().optional().run(request)
    await body('options.sendVideoAsGif').isBoolean().optional().run(request)
    await body('options.sendMediaAsSticker').isBoolean().optional().run(request)
    await body('options.sendMediaAsDocument').isBoolean().optional().run(request)
    await body('options.caption').isString().optional().run(request)
    await body('options.quotedMessageId').isString().optional().run(request)
    await body('options.mentions').isArray().optional().run(request)
    await body('options.sendSeen').isBoolean().optional().run(request)
    await body('options.stickerName').isString().optional().run(request)
    await body('options.stickerAuthor').isString().optional().run(request)
    await body('options.stickerCategories').isArray().optional().run(request)

    Validator(request, response)
}
