import container from './container'
import Controller from './Libs/Controller'

const { app, whatsapp, webServer, webSocket, logger, homeAssistant } = container

const controller = new Controller(app, logger, whatsapp, webServer, webSocket, homeAssistant)
controller.start()
