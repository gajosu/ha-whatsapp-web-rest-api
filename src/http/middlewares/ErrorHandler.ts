import { ValidationError } from './../../Exceptions/ValidationError'
import { ILogger } from './../../Libs/Logger'
import Express from 'express'
import { NotFoundError } from '../../Exceptions/NotFoundError'
import HttpError from '../../Exceptions/HttpError'

const handleErrors = (
    err: Error,
    req: Express.Request,
    res: Express.Response,
    next: any
) => ({ logger }: { logger: ILogger }) => {
    if (err instanceof ValidationError) {
        logger.warn(err.message, err.messages)
        res.status(422).json({ errors: err.messages })
        return
    }

    if (err instanceof NotFoundError) {
        logger.warn(err.message)
        res.status(404).json({ error: err.message })
        return
    }

    if (err instanceof HttpError) {
        logger.warn(err.message)
        res.status(err.status).json({ error: err.message })
        return
    }

    logger.error('Internal Server Error', err)
    res.status(500).json({ error: 'Internal Server Error' })
}

export default handleErrors
