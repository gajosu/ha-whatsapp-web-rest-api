import MessageStar, { IMessageStar } from './Services/Message/MessageStar'
import MessageReact, { IMessageReact } from './Services/Message/MessageReact'
import MessageDeleter, { IMessageDeleter } from './Services/Message/MessageDeleter'
import MessageGetter, { IMessageGetter } from './Services/Message/MessageGetter'
import ChatStateSender, { IChatStateSender } from './Services/Chat/ChatStateSender'
import ChatReader, { IChatReader } from './Services/Chat/ChatReader'
import ChatPin, { IChatPin } from './Services/Chat/ChatPin'
import ChatMute, { IChatMute } from './Services/Chat/ChatMute'
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
import ChatDeleter, { IChatDeleter } from './Services/Chat/ChatDeleter'
import ChatFinder, { IChatFinder } from './Services/Chat/ChatFinder'
import ChatGetter, { IChatGetter } from './Services/Chat/ChatGetter'
import ChatArchive, { IChatArchive } from './Services/Chat/ChatArchive'
import MessageFinder, { IMessageFinder } from './Services/Message/MessageFinder'

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
    chatGetter: IChatGetter
    chatFinder: IChatFinder
    chatArchive: IChatArchive
    chatMute: IChatMute
    chatPin: IChatPin
    chatReader: IChatReader
    chatStateSender: IChatStateSender
    chatDeleter: IChatDeleter
    messageGetter: IMessageGetter
    messageFinder: IMessageFinder
    messageDeleter: IMessageDeleter
    messageReact: IMessageReact
    messageStar: IMessageStar
}

const webConfig = getHttpServer()
const whatsappClient = getWhatsappClient()
const haToken = process.env.SUPERVISOR_TOKEN
const haBaseUrl = process.env.HA_BASE_URL

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
        new EventPublisher(logger, haToken, haBaseUrl),

    homeAssistant: ({ logger, eventBus, haEventPublisher }) =>
        new HomeAssistant(logger, eventBus, haEventPublisher),

    chatGetter: ({ whatsapp }) =>
        new ChatGetter(whatsapp),

    chatFinder: ({ whatsapp }) =>
        new ChatFinder(whatsapp),

    chatArchive: ({ chatFinder }) =>
        new ChatArchive(chatFinder),

    chatMute: ({ chatFinder }) =>
        new ChatMute(chatFinder),

    chatPin: ({ chatFinder }) =>
        new ChatPin(chatFinder),

    chatReader: ({ chatFinder }) =>
        new ChatReader(chatFinder),

    chatStateSender: ({ chatFinder }) =>
        new ChatStateSender(chatFinder),

    chatDeleter: ({ chatFinder }) =>
        new ChatDeleter(chatFinder),

    messageGetter: ({ chatFinder }) =>
        new MessageGetter(chatFinder),

    messageFinder: ({ chatFinder }) =>
        new MessageFinder(chatFinder),

    messageDeleter: ({ messageFinder }) =>
        new MessageDeleter(messageFinder),

    messageReact: ({ messageFinder }) =>
        new MessageReact(messageFinder),

    messageStar: ({ messageFinder }) =>
        new MessageStar(messageFinder)
})
