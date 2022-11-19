import diContainer from 'true-di'

import { getHttpServer, IHttpServer } from './config/HttpServer'
import { EventBus, IEventBus } from './Libs/EventBus'
import Logger, { ILogger } from './Libs/Logger'
import WebServer, { IWebServer } from './Libs/WebServer'
import WebSocket, { IWebSocket } from './Libs/WebSocket'
import Whatsapp, { IWhatsapp } from './Libs/Whatsapp'
import TextMessageCreator, { ITextMessageCreator } from './Services/Message/TextMessageCreator'
import MediaUrlMessageCreator, { IMediaUrlMessageCreator } from './Services/Message/MediaUrlMessageCreator'
import { getClient as getWhatsappClient } from './config/WhatsappClient'
import EventPublisher, { IEventPublisher } from './Services/HomeAssistant/EventPublisher'
import HomeAssistant, { IHomeAssistant } from './Libs/HomeAssistant'

export interface IServices {
    app: IHttpServer
    logger: ILogger
    eventBus: IEventBus
    whatsapp: IWhatsapp
    webServer: IWebServer
    webSocket: IWebSocket
    textMessageCreator: ITextMessageCreator
    mediaUrlMessageCreator: IMediaUrlMessageCreator
    haEventPublisher: IEventPublisher
    homeAssistant: IHomeAssistant
}

const webConfig = getHttpServer()
const whatsappClient = getWhatsappClient()

export default diContainer<IServices>({
    app: () =>
        webConfig,

    logger: () =>
        new Logger(),

    eventBus: () =>
        new EventBus(),

    whatsapp: ({ logger, eventBus }) =>
        new Whatsapp(whatsappClient, logger, eventBus),

    webServer: ({ app, logger }) =>
        new WebServer(app.app, logger),

    webSocket: ({ app, logger, eventBus }) =>
        new WebSocket(app.server, logger, eventBus),

    textMessageCreator: ({ whatsapp }) =>
        new TextMessageCreator(whatsapp),

    mediaUrlMessageCreator: ({ whatsapp }) =>
        new MediaUrlMessageCreator(whatsapp),

    haEventPublisher: ({ logger }) =>
        new EventPublisher(logger),

    homeAssistant: ({ logger, eventBus, haEventPublisher }) =>
        new HomeAssistant(logger, eventBus, haEventPublisher)
})
