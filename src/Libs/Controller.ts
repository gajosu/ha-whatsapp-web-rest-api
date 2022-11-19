import { IHttpServer } from './../config/HttpServer'
import getConfig from '../config/GlobalConfig'
import { IWebSocket } from './WebSocket'
import { IWebServer } from './WebServer'
import { IWhatsapp } from './Whatsapp'
import { ILogger } from './Logger'
import { IHomeAssistant } from './HomeAssistant'

export default class Controller {
    constructor (
        private readonly app: IHttpServer,
        private readonly logger: ILogger,
        private readonly whatsapp: IWhatsapp,
        private readonly webserver: IWebServer,
        private readonly websocket: IWebSocket,
        private readonly homeAssistant: IHomeAssistant
    ) {
    }

    public start (): void {
        this.logger.info('Starting Controller')
        this.whatsapp.start()
        this.webserver.start()
        this.websocket.start()
        this.homeAssistant.start()

        const port = getConfig<number>('port', 3000)
        const httpLogger = this.logger.getCategoryLogger('HttpServer', 'yellow')

        this.app.server.listen(port, () => {
            httpLogger.info(`⚡ Listening http://0.0.0.0:${port}`)
        })
    }
}
