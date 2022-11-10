import { Server } from "socket.io"
import http from 'http'
import whatsapp from "./Whatsapp"

export default class WebSocket {

    private io: Server;

    constructor(
        private http: http.Server,
        private whatsapp: whatsapp
    ) {

    }

    public start() {
        this.io = new Server(this.http);
        this.io.on("connection", async (socket) => {
            // console.log('connected');
        });
    }
}