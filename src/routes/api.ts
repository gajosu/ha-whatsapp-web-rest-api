import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import { store } from '../http/controllers/MessageController'
import { body } from 'express-validator'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.route('/messages')
        .post(
            body('to').isString(),
            // if msg is not send url is required
            body('msg').optional().isString(),
            body('url').optional().isString(),
            context.consumer(store)
        )

    return router
}
