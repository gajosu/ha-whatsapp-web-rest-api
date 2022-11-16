import container from './container'
import Controller from './Libs/Controller'

const { whatsapp, webServer, webSocket } = container

const controller = new Controller(whatsapp, webServer, webSocket)
controller.start()
