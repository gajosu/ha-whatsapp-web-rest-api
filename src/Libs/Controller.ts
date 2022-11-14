
import Logger from './Logger';
import WebServer from './WebServer';
import WebSocket from './WebSocket';
import Whatsapp from './Whatsapp';

export default class Controller {

    private logger: Logger = new Logger();
    constructor(
        private whatsapp: Whatsapp,
        private webserver: WebServer,
        private websocket: WebSocket
    ) {
    }

    public start() {
        this.logger.info('Starting Controller');
        this.whatsapp.start();

        this.webserver.start();
        this.websocket.start();
    }
}