import express from 'express'
import { IServices } from '../container'
import { ContextManager } from 'express-async-context/lib/types'
import * as MessageController from '../http/controllers/MessageController'
import * as ChatController from '../http/controllers/ChatController'
import * as ChatMessageController from '../http/controllers/ChatMessageController'
import * as GroupChatController from '../http/controllers/GroupChatController'
import WhatsappStatusChecker from '../http/middlewares/WhatsappStatusChecker'

export default function (context: ContextManager<IServices>): express.Router {
    const router = express.Router()
    router.use(context.consumer(WhatsappStatusChecker))

    router.route('/messages').post(
        context.consumer(MessageController.store)
    )

    router.route('/chats').get(
        context.consumer(ChatController.index)
    )

    router.route('/chats/:id').delete(
        context.consumer(ChatController.deleteChat)
    )

    router.route('/chats/:id/archive').put(
        context.consumer(ChatController.archiveChat)
    )

    router.route('/chats/:id/unarchive').put(
        context.consumer(ChatController.unarchiveChat)
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

    router.route('/chats/:id/messages').get(
        context.consumer(ChatMessageController.index)
    )

    router.route('/chats/:id/messages/:messageId/star').put(
        context.consumer(ChatMessageController.star)
    )

    router.route('/chats/:id/messages/:messageId/unstar').put(
        context.consumer(ChatMessageController.unstar)
    )

    router.route('/chats/:id/messages/:messageId/react').put(
        context.consumer(ChatMessageController.react)
    )

    router.route('/chats/:id/messages/:messageId').delete(
        context.consumer(ChatMessageController.destroy)
    )

    router.route('/chats/groups').post(
        context.consumer(GroupChatController.store)
    )

    router.route('/chats/groups/:id').get(
        context.consumer(GroupChatController.show)
    )

    router.route('/chats/groups/:id').put(
        context.consumer(GroupChatController.update)
    )

    router.route('/chats/groups/:id/invite-code').get(
        context.consumer(GroupChatController.getInvitationCode)
    )

    router.route('/chats/groups/:id/invite-code/revoke').put(
        context.consumer(GroupChatController.revokeInvitationCode)
    )

    router.route('/chats/groups/accept-invite/:inviteCode').put(
        context.consumer(GroupChatController.acceptInvitationCode)
    )

    router.route('/chats/groups/:id/leave').put(
        context.consumer(GroupChatController.leave)
    )

    router.route('/chats/groups/:id/participants').post(
        context.consumer(GroupChatController.addParticipants)
    )

    router.route('/chats/groups/:id/participants').delete(
        context.consumer(GroupChatController.removeParticipants)
    )

    router.route('/chats/groups/:id/participants/promote').put(
        context.consumer(GroupChatController.promoteParticipants)
    )

    router.route('/chats/groups/:id/participants/demote').put(
        context.consumer(GroupChatController.demoteParticipants)
    )

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

    // router.route('/status').get(
    //     context.consumer(store)
    // )

    return router
}
