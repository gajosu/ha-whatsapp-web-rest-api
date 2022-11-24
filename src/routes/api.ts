import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import { store } from '../http/controllers/MessageController'
import WhatsappStatusChecker from '../http/middlewares/WhatsappStatusChecker'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.use(context.consumer(WhatsappStatusChecker))

    router.route('/messages').post(
        context.consumer(store)
    )

    router.route('/chats').get(
        context.consumer(store)
    )

    router.route('/chats').delete(
        context.consumer(store)
    )

    router.route('/chats/:id/archive').put(
        context.consumer(store)
    )

    router.route('/chats/:id/unarchive').put(
        context.consumer(store)
    )

    router.route('/chats/:id/mute').put(
        context.consumer(store)
    )

    router.route('/chats/:id/unmute').put(
        context.consumer(store)
    )

    router.route('/chats/:id/pin').put(
        context.consumer(store)
    )

    router.route('/chats/:id/unpin').put(
        context.consumer(store)
    )

    router.route('/chats/:id/mark-as-read').put(
        context.consumer(store)
    )

    router.route('/chats/:id/mark-as-unread').put(
        context.consumer(store)
    )

    router.route('/chats/:id/send-typing').put(
        context.consumer(store)
    )

    router.route('/chats/:id/send-recording').put(
        context.consumer(store)
    )

    router.route('/chats/:id/clear-state').put(
        context.consumer(store)
    )

    router.route('/chats/:id/messages').get(
        context.consumer(store)
    )

    router.route('/chats/:id/messages').delete(
        context.consumer(store)
    )

    router.route('/chats/group').post(
        context.consumer(store)
    )

    router.route('/chats/group/:id/leave').put(
        context.consumer(store)
    )

    router.route('/me/available').put(
        context.consumer(store)
    )

    router.route('/me/unavailable').put(
        context.consumer(store)
    )

    router.route('/me/display-name').put(
        context.consumer(store)
    )

    router.route('/me/status').put(
        context.consumer(store)
    )

    return router
}
