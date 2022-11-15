import {Server, Socket} from "socket.io"
import http from 'http'
import Logger from "./Logger";
import {EventBus} from './EventBus';

export interface IWebSocket {
    start(): void;
    stop(): void;
}

export default class WebSocket implements IWebSocket {

    private io : Server;
    private logger = new Logger('WebSocket', 'magenta');

    constructor(private httpServer : http.Server) {}

    public start() {
        this.logger.info("Starting WebSocket");
        this.io = new Server(this.httpServer);
        this.io.on("connection", this.onConnection.bind(this));
    }

    public stop() {
        this.logger.info("Stopping WebSocket");
        this.io.close();
    }

    private onConnection(socket : Socket) {
        EventBus.getInstance().dispatch("socket.connection", socket);
        this.logger.info("New connection from " + socket.id);

        const qrListener = EventBus.getInstance().register("whatsapp.qr", (qr : string) => {
            socket.emit("qr_code", {data: qr});
        });

        socket.on("disconnect", (reason : string) => {
            this.logger.info("Disconnect from " + socket.id + ", reason: " + reason);
            EventBus.getInstance().dispatch("socket.disconnect", socket);
            qrListener.unregister();
        });
    }
}
