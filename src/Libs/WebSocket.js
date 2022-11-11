import { Server } from "socket.io"
import http from 'http'
import { EventBus } from '../../src/Libs/EventBus';

export default class WebSocket {

    private io: Server;

    constructor(
        private http: http.Server,
    ) {

    }

    public start() {
        this.io = new Server(this.http);
        this.io.on("connection", async (socket) => {
            EventBus.getInstance().dispatch("socket:connection", socket);
        });
    }
}