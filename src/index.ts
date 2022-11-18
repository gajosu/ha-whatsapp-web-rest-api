import container from './container'
import Controller from './Libs/Controller'

const { app, whatsapp, webServer, webSocket, logger } = container

const controller = new Controller(app, logger, whatsapp, webServer, webSocket)
controller.start()
