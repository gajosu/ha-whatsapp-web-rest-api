import container from './container'
import Controller from './Libs/Controller'

const { whatsapp, webServer, webSocket, logger } = container

const controller = new Controller(logger, whatsapp, webServer, webSocket)
controller.start()
