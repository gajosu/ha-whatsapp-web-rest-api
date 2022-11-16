import { IWebSocket } from './WebSocket'
import { IWebServer } from './WebServer'
import { IWhatsapp } from './Whatsapp'

import Logger from './Logger'

export default class Controller {
    private readonly logger: Logger = new Logger()
    constructor (
        private readonly whatsapp: IWhatsapp,
        private readonly webserver: IWebServer,
        private readonly websocket: IWebSocket
    ) {
    }

    public start (): void {
        this.logger.info('Starting Controller')
        this.whatsapp.start()

        this.webserver.start()
        this.websocket.start()
    }
}
