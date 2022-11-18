import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import { store } from '../http/controllers/MessageController'
import WhatsappStatusChecker from '../http/middlewares/WhatsappStatusChecker'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.use(context.consumer(WhatsappStatusChecker))
    router.route('/messages')
        .post(
            context.consumer(store)
        )

    return router
}
