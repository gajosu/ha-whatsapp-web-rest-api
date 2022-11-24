import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import { store } from '../http/controllers/MessageController'
import * as ChatController from '../http/controllers/ChatController'
import WhatsappStatusChecker from '../http/middlewares/WhatsappStatusChecker'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.use(context.consumer(WhatsappStatusChecker))

    router.route('/messages').post(
        context.consumer(store)
    )

    router.route('/chats').get(
        context.consumer(ChatController.index)
    )

    router.route('/chats').delete(
        context.consumer(ChatController.deleteChat)
    )

    router.route('/chats/:id/archive').put(
        context.consumer(ChatController.archiveChat)
    )

    router.route('/chats/:id/unarchive').put(
        context.consumer(ChatController.unarchiveChat)
    )

    router.route('/chats/:id/mute').put(
        context.consumer(ChatController.muteChat)
    )

    router.route('/chats/:id/unmute').put(
        context.consumer(ChatController.unmuteChat)
    )

    router.route('/chats/:id/pin').put(
        context.consumer(ChatController.pinChat)
    )

    router.route('/chats/:id/unpin').put(
        context.consumer(ChatController.unpinChat)
    )

    router.route('/chats/:id/mark-as-read').put(
        context.consumer(ChatController.markChatAsRead)
    )

    router.route('/chats/:id/mark-as-unread').put(
        context.consumer(ChatController.markChatAsUnread)
    )

    router.route('/chats/:id/send-typing').put(
        context.consumer(ChatController.sendTypingState)
    )

    router.route('/chats/:id/send-recording').put(
        context.consumer(ChatController.sendRecordingState)
    )

    router.route('/chats/:id/clear-state').put(
        context.consumer(ChatController.sendClearState)
    )

    // router.route('/chats/:id/messages').get(
    //     context.consumer(store)
    // )

    // router.route('/chats/:id/messages').delete(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups').post(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id').put(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/invite-code').get(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/invite-code/regenerate').put(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/leave').put(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/participants').get(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/participants').post(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/participants').delete(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/participants/promote').put(
    //     context.consumer(store)
    // )

    // router.route('/chats/groups/:id/participants/demote').put(
    //     context.consumer(store)
    // )

    // router.route('/contacts').get(
    //     context.consumer(store)
    // )

    // router.route('/contacts/block').put(
    //     context.consumer(store)
    // )

    // router.route('/contacts/unblock').put(
    //     context.consumer(store)
    // )

    // router.route('/me/available').put(
    //     context.consumer(store)
    // )

    // router.route('/me/unavailable').put(
    //     context.consumer(store)
    // )

    // router.route('/me/display-name').put(
    //     context.consumer(store)
    // )

    // router.route('/me/status').put(
    //     context.consumer(store)
    // )

    return router
}
