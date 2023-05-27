import { Server, Socket } from 'socket.io'
import http from 'http'
import { ILogger } from './Logger'
import { IEventBus } from './EventBus'
import { IQRCodeEvent, IMessageEvent, IMessageAckEvent, IStateChangeEvent, IMessageRevokeForEveryoneEvent, IMessageRevokeForMeEvent, IGroupNotificationEvent, ICallEvent, IAuthFailureEvent, IMessageReactionEvent } from './Whatsapp'
import qrCode from 'qrcode'

export interface IWebSocket {
    start: () => void
    stop: () => void
}

export default class WebSocket implements IWebSocket {
    private io: Server

    constructor (private readonly httpServer: http.Server, private readonly logger: ILogger, private readonly eventBus: IEventBus) {
        this.logger = logger.getCategoryLogger('WebSocket', 'magenta')
    }

    public start (): void {
        this.logger.info('Starting WebSocket')
        this.io = new Server(this.httpServer)
        this.io.on('connection', this.onConnection.bind(this))
        this.eventBus.register('whatsapp.authenticated', this.onAuthenticated.bind(this))
        this.eventBus.register('whatsapp.auth_failure', this.onAuthFailure.bind(this))
        this.eventBus.register('whatsapp.disconnected', this.onDisconnected.bind(this))
        this.eventBus.register('whatsapp.message', this.onMessage.bind(this))
        this.eventBus.register('whatsapp.message.create', this.onCreatedMessage.bind(this))
        this.eventBus.register('whatsapp.message.ack', this.onMessageAck.bind(this))
        this.eventBus.register('whatsapp.message.reaction', this.onMessageReaction.bind(this))
        this.eventBus.register('whatsapp.revoke_for_everyone', this.onMessageRevokeForEveryone.bind(this))
        this.eventBus.register('whatsapp.revoke_for_me', this.onMessageRevokeForMe.bind(this))
        this.eventBus.register('whatsapp.group.join', this.onGroupJoin.bind(this))
        this.eventBus.register('whatsapp.group.leave', this.onGroupLeave.bind(this))
        this.eventBus.register('whatsapp.group.update', this.onGroupUpdate.bind(this))
        this.eventBus.register('whatsapp.call', this.onCall.bind(this))
        this.eventBus.register('whatsapp.state', this.onChangedState.bind(this))
    }

    public stop (): void {
        this.logger.info('Stopping WebSocket')
        this.io.close()
    }

    private onConnection (socket: Socket): void {
        this.eventBus.dispatch('socket.connection', socket)
        this.logger.info('New connection from ' + socket.id)

        const qrListener = this.eventBus.register('whatsapp.qr', (event: IQRCodeEvent): void => {
            void (async () => {
                const qrCodeBase64 = await qrCode.toDataURL(event.qr, { width: 300 })
                socket.emit('qr_code', { data: qrCodeBase64 })
            })()
        })

        socket.on('disconnect', (reason: string) => {
            this.logger.info('Disconnect from ' + socket.id + ', reason: ' + reason)
            this.eventBus.dispatch('socket.disconnect', socket)
            qrListener.unregister()
        })
    }

    private onMessage (data: IMessageEvent): void {
        this.io.emit('message', data.message.rawData)
        this.logger.debug('New message')
    }

    private onCreatedMessage (data: IMessageEvent): void {
        this.io.emit('message.create', data.message.rawData)
        this.logger.debug('New message create')
    }

    private onMessageAck (data: IMessageAckEvent): void {
        this.io.emit('message.ack', {
            message: data.message.rawData,
            ack: data.ack
        })
        this.logger.debug('New message ack')
    }

    private onMessageReaction (data: IMessageReactionEvent): void {
        this.io.emit('message.reaction', data.reaction)
        this.logger.debug('New message reaction')
    }

    private onMessageRevokeForEveryone (data: IMessageRevokeForEveryoneEvent): void {
        this.io.emit('message.revoke_for_everyone', {
            message: data.message.rawData,
            revokedMessage: data.revokedMessage.rawData
        })
        this.logger.debug('Message revoke for everyone')
    }

    private onMessageRevokeForMe (data: IMessageRevokeForMeEvent): void {
        this.io.emit('message.revoke_for_me', {
            message: data.message.rawData
        })

        this.logger.debug('Message revoke for me')
    }

    private onGroupJoin (data: IGroupNotificationEvent): void {
        this.io.emit('group.join', data)
        this.logger.debug('Group join')
    }

    private onGroupLeave (data: IGroupNotificationEvent): void {
        this.io.emit('group.leave', data)
        this.logger.debug('Group leave')
    }

    private onGroupUpdate (data: IGroupNotificationEvent): void {
        this.io.emit('group.update', data)
        this.logger.debug('Group update')
    }

    private onCall (data: ICallEvent): void {
        this.io.emit('call', data)
        this.logger.debug('Call')
    }

    private onChangedState (data: IStateChangeEvent): void {
        this.io.emit('state.change', data)
        this.logger.debug('New state change')
    }

    private onAuthenticated (): void {
        this.io.emit('authenticated')
        this.logger.debug('Authenticated')
    }

    private onAuthFailure (data: IAuthFailureEvent): void {
        this.io.emit('auth_failure', data)
        this.logger.debug('Auth failure')
    }

    private onDisconnected (state: IStateChangeEvent): void {
        this.io.emit('disconnected', state)
        this.logger.debug('Disconnected')
    }
}
