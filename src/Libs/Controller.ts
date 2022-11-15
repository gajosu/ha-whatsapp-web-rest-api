import { IWebSocket } from './WebSocket';
import { IWebServer } from './WebServer';
import { IWhatsapp } from './Whatsapp';

import Logger from './Logger';


export default class Controller {

    private logger: Logger = new Logger();
    constructor(
        private whatsapp: IWhatsapp,
        private webserver: IWebServer,
        private websocket: IWebSocket
    ) {
    }

    public start() {
        this.logger.info('Starting Controller');
        this.whatsapp.start();

        this.webserver.start();
        this.websocket.start();
    }
}