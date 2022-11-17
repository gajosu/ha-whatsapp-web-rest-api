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

export interface IMessageRevokeForEveryoneEvent {
    message: WAWebJS.Message
    revokedMessage: WAWebJS.Message
}

export interface IMessageRevokeForMeEvent {
    message: WAWebJS.Message
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
        this.client.on('disconnected', this.onDisconnected.bind(this))
        this.client.on('message', this.onMessage.bind(this))
        this.client.on('message_create', this.onMessageCreate.bind(this))
        this.client.on('message_ack', this.onMessageAck.bind(this))
        this.client.on('message_revoke_everyone', this.onMessageRevokeForEveryone.bind(this))
        this.client.on('message_revoke_me', this.onMessageRevokeForMe.bind(this))
        this.client.on('change_state', this.onChangeState.bind(this))

        return await this.client.initialize().then(() => {
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

    private async onDisconnected (): Promise<void> {
        await this.client.destroy()
        await this.client.initialize()

        this.logger.info('Client is disconnected')
        this.eventBus.dispatch('whatsapp.disconnected')
    }

    private onLoadingScreen (): void {
        this.logger.info('Client is loading screen')
    }

    private onQr (qr: string): void {
        this.logger.info('QR Code Received', qr)
        Qrcode.generate(qr, { small: true })

        const event: IQRCodeEvent = {
            qr
        }

        this.eventBus.dispatch('whatsapp.qr', event)
    }

    private onMessage (message: WAWebJS.Message): void {
        this.logger.info('Message received', message)

        const event: IMessageEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message', event)
    }

    private onMessageCreate (message: WAWebJS.Message): void {
        if (!message.fromMe) {
            return
        }
        this.logger.info('Message created', message)

        const event: IMessageEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message.create', event)
    }

    private onMessageAck (message: WAWebJS.Message, ack: WAWebJS.MessageAck): void {
        this.logger.info('Message ack', message.id, ack)

        const event: IMessageAckEvent = {
            message,
            ack
        }

        this.eventBus.dispatch('whatsapp.message.ack', event)
    }

    private onMessageRevokeForEveryone (message: WAWebJS.Message, revokedMessage: WAWebJS.Message): void {
        this.logger.info('Message revoke for everyone', message.id, revokedMessage.id)

        const event: IMessageRevokeForEveryoneEvent = {
            message,
            revokedMessage
        }

        this.eventBus.dispatch('whatsapp.message.revoke_for_everyone', event)
    }

    private onMessageRevokeForMe (message: WAWebJS.Message): void {
        this.logger.info('Message revoke for me', message.id)

        const event: IMessageRevokeForMeEvent = {
            message
        }

        this.eventBus.dispatch('whatsapp.message.revoke_for_me', event)
    }

    private onChangeState (state: WAWebJS.WAState): void {
        this.logger.info('State changed', state)

        const event: IStateChangeEvent = {
            state
        }

        this.eventBus.dispatch('whatsapp.state', event)
    }

    public getClient (): Client {
        return this.client
    }
}
