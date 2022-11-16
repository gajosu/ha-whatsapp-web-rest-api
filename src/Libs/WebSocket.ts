import { Server, Socket } from 'socket.io'
import http from 'http'
import { ILogger } from './Logger'
import { IEventBus } from './EventBus'
import { IQRCodeEvent, IMessageEvent, IMessageAckEvent } from './Whatsapp'

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
        this.eventBus.register('whatsapp.message', this.onMessage.bind(this))
        this.eventBus.register('whatsapp.message.create', this.onCreatedMessage.bind(this))
        this.eventBus.register('whatsapp.message.ack', this.onMessageAck.bind(this))
    }

    public stop (): void {
        this.logger.info('Stopping WebSocket')
        this.io.close()
    }

    private onConnection (socket: Socket): void {
        this.eventBus.dispatch('socket.connection', socket)
        this.logger.info('New connection from ' + socket.id)

        const qrListener = this.eventBus.register('whatsapp.qr', (event: IQRCodeEvent) => {
            socket.emit('qr_code', { data: event.qr })
        })

        socket.on('disconnect', (reason: string) => {
            this.logger.info('Disconnect from ' + socket.id + ', reason: ' + reason)
            this.eventBus.dispatch('socket.disconnect', socket)
            qrListener.unregister()
        })
    }

    private onMessage (data: IMessageEvent): void {
        this.io.emit('message', data)
        this.logger.info('New message')
    }

    private onCreatedMessage (data: IMessageEvent): void {
        this.io.emit('message.create', data)
        this.logger.info('New message create')
    }

    private onMessageAck (data: IMessageAckEvent): void {
        this.io.emit('message.ack', data)
        this.logger.info('New message ack')
    }
}
