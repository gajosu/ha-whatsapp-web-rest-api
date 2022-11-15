import { Server, Socket } from "socket.io"
import http from 'http'
import { ILogger } from "./Logger";
import { IEventBus } from './EventBus';

export interface IWebSocket {
    start(): void;
    stop(): void;
}

export default class WebSocket implements IWebSocket {

    private io: Server;

    constructor(private httpServer: http.Server, private logger: ILogger, private eventBus: IEventBus) {
        this.logger = logger.getCategoryLogger('WebSocket', 'magenta')
    }

    public start() {
        this.logger.info("Starting WebSocket");
        this.io = new Server(this.httpServer);
        this.io.on("connection", this.onConnection.bind(this));

        this.eventBus.register("whatsapp.message", (data: any) => {
            this.io.emit("message", { data });
            this.logger.info("New message");
        });

        this.eventBus.register("whatsapp.message.create", (data: any) => {
            this.io.emit("message_create", { data });
            this.logger.info("New message create");
        });

        this.eventBus.register("whatsapp.message.ack", (data: any) => {
            this.io.emit("message_ack", { data });
            this.logger.info("New message ack");
        });
    }

    public stop() {
        this.logger.info("Stopping WebSocket");
        this.io.close();
    }

    private onConnection(socket: Socket) {
        this.eventBus.dispatch("socket.connection", socket);
        this.logger.info("New connection from " + socket.id);

        const qrListener = this.eventBus.register("whatsapp.qr", (qr: string) => {
            socket.emit("qr_code", { data: qr });
        });

        socket.on("disconnect", (reason: string) => {
            this.logger.info("Disconnect from " + socket.id + ", reason: " + reason);
            this.eventBus.dispatch("socket.disconnect", socket);
            qrListener.unregister();
        });
    }
}
