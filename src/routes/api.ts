import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import { store } from '../http/controllers/MessageController'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.route('/messages')
        .post(
            context.consumer(store)
        )

    return router
}
