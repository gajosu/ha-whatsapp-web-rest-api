import WAWebJS, { Client } from 'whatsapp-web.js'
import { ILogger } from './Logger'
import { IEventBus } from './EventBus'
import Qrcode from 'qrcode-terminal'
import { exit } from 'process'

export interface IWhatsapp {
    start: () => void
    stop: () => void
    getClient: () => Client
}

export interface IAuthFailureEvent {
    message: string
}

export interface IQRCodeEvent {
    qr: string
}

export interface IMessageEvent {
    message: WAWebJS.Message
}

export interface IMessageAckEvent {
    message: WAWebJS.Message
    ack: WAWebJS.MessageAck
}

export interface IMessageReactionEvent {
    reaction: WAWebJS.Reaction
}

export interface IMessageRevokeForEveryoneEvent {
    message: WAWebJS.Message
    revokedMessage: WAWebJS.Message
}

export interface IMessageRevokeForMeEvent {
    message: WAWebJS.Message
}

export interface IGroupNotificationEvent {
    notification: WAWebJS.GroupNotification
}

export interface ICallEvent {
    call: WAWebJS.Call
}

export interface IStateChangeEvent {
    state: WAWebJS.WAState
}

export default class Whatsapp implements IWhatsapp {
    public constructor (
        private readonly client: Client,
        private readonly logger: ILogger,
        private readonly eventBus: IEventBus
    ) {
        this.logger = logger.getCategoryLogger('Whatsapp', 'green')
    }

    public async start (): Promise<void> {
        this.logger.info('Starting Client')
        this.client.on('qr', this.onQr.bind(this))
        this.client.on('ready', this.onReady.bind(this))
        this.client.on('loading_screen', this.onLoadingScreen.bind(this))
        this.client.on('authenticated', this.onAuthenticated.bind(this))
        this.client.on('auth_failure', this.onAuthFailure.bind(this))
        this.client.on('disconnected', this.onDisconnected.bind(this))
        this.client.on('message', this.onMessage.bind(this))
        this.client.on('message_create', this.onMessageCreate.bind(this))
        this.client.on('message_ack', this.onMessageAck.bind(this))
        this.client.on('message_reaction', this.onMessageReaction.bind(this))
        this.client.on('message_revoke_everyone', this.onMessageRevokeForEveryone.bind(this))
        this.client.on('message_revoke_me', this.onMessageRevokeForMe.bind(this))
        this.client.on('group_join', this.onGroupJoin.bind(this))
        this.client.on('group_leave', this.onGroupLeave.bind(this))
        this.client.on('group_update', this.onGroupUpdate.bind(this))
        this.client.on('incoming_call', this.onCall.bind(this))
        this.client.on('change_state', this.onChangeState.bind(this))

        await this.client.initialize().then(() => {
            this.logger.info('Client initialized')
        }).catch((err: Error) => {
            this.logger.error('Client fatal error', err)
            exit(1)
        })
    }

    public async stop (): Promise<void> {
        this.logger.info('Stopping Client')
        await this.client.destroy()
    }

    private onReady (): void {
        this.logger.info('Client is ready!')
        this.eventBus.dispatch('whatsapp.ready')
    }

    private onAuthenticated (): void {
        this.logger.info('Client is authenticated')
        this.eventBus.dispatch('whatsapp.authenticated')
    }

    private onAuthFailure (message: string): void {
        const event: IAuthFailureEvent = {
            message
        }

        this.logger.error('Client authentication failure', event)
        this.eventBus.dispatch('whatsapp.auth_failure', event)
    }

    private async onDisconnected (reason: WAWebJS.WAState): Promise<void> {
        await this.client.destroy()
        await this.client.initialize()

        const event: IStateChangeEvent = {
            state: reason
        }

        this.logger.info('Client is disconnected', reason)
        this.eventBus.dispatch('whatsapp.disconnected', event)
    }

    private onLoadingScreen (): void {
        this.logger.info('Client is loading screen')
    }

    private onQr (qr: string): void {
        this.logger.debug('QR Code Received', qr)
        Qrcode.generate(qr, { small: true })

        const event: IQRCodeEvent = {
            qr
        }

        this.eventBus.dispatch('whatsapp.qr', event)
    }

    private onMessage (message: WAWebJS.Message): void {
        // ignore status messages
        if (message.isStatus) {
            return
        }

        this.logger.debug('Message received', message.id)

        const event: IMessageEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message', event)
    }

    private onMessageCreate (message: WAWebJS.Message): void {
        if (!message.fromMe) {
            return
        }
        this.logger.debug('Message created', message.id)

        const event: IMessageEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message.create', event)
    }

    private onMessageAck (message: WAWebJS.Message, ack: WAWebJS.MessageAck): void {
        this.logger.debug('Message ack', message.id, ack)

        const event: IMessageAckEvent = {
            message,
            ack
        }

        this.eventBus.dispatch('whatsapp.message.ack', event)
    }

    private onMessageReaction (reaction: WAWebJS.Reaction): void {
        this.logger.debug('Message reaction', reaction)

        const event: IMessageReactionEvent = {
            reaction
        }

        this.eventBus.dispatch('whatsapp.message.reaction', event)
    }

    private onMessageRevokeForEveryone (message: WAWebJS.Message, revokedMessage: WAWebJS.Message): void {
        this.logger.debug('Message revoke for everyone', message.id, revokedMessage.id)

        const event: IMessageRevokeForEveryoneEvent = {
            message,
            revokedMessage
        }

        this.eventBus.dispatch('whatsapp.message.revoke_for_everyone', event)
    }

    private onMessageRevokeForMe (message: WAWebJS.Message): void {
        this.logger.debug('Message revoke for me', message.id)

        const event: IMessageRevokeForMeEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message.revoke_for_me', event)
    }

    private onGroupJoin (notification: WAWebJS.GroupNotification): void {
        this.logger.debug('Group join', notification.id)

        const event: IGroupNotificationEvent = {
            notification
        }

        this.eventBus.dispatch('whatsapp.group.join', event)
    }

    private onGroupLeave (notification: WAWebJS.GroupNotification): void {
        this.logger.debug('Group leave', notification.id)

        const event: IGroupNotificationEvent = {
            notification
        }

        this.eventBus.dispatch('whatsapp.group.leave', event)
    }

    private onGroupUpdate (notification: WAWebJS.GroupNotification): void {
        this.logger.debug('Group update', notification.id)

        const event: IGroupNotificationEvent = {
            notification
        }

        this.eventBus.dispatch('whatsapp.group.update', event)
    }

    private onCall (call: WAWebJS.Call): void {
        this.logger.debug('Call', call.id)

        const event: ICallEvent = {
            call
        }

        this.eventBus.dispatch('whatsapp.call', event)
    }

    private onChangeState (state: WAWebJS.WAState): void {
        this.logger.debug('State changed', state)

        const event: IStateChangeEvent = {
            state
        }

        this.eventBus.dispatch('whatsapp.state', event)
    }

    public getClient (): Client {
        return this.client
    }
}
