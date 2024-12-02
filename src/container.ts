import ContactBlock, { IContactBlock } from './Services/Contact/ContactBlock'
import ContactFinder, { IContactFinder } from './Services/Contact/ContactFinder'
import GroupParticipant, { IGroupParticipant } from './Services/GroupChat/GroupParticipant'
import GroupChatUpdater, { IGroupChatUpdater } from './Services/GroupChat/GroupChatUpdater'
import GroupChatCreator, { IGroupChatCreator } from './Services/GroupChat/GroupChatCreator'
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
import GroupChatFinder, { IGroupChatFinder } from './Services/GroupChat/GroupChatFinder'
import GroupChatInvite, { IGroupChatInvite } from './Services/GroupChat/GroupChatInvite'
import ContactGetter, { IContactGetter } from './Services/Contact/ContactGetter'
import DisplayNameUpdater, { IDisplayNameUpdater } from './Services/Me/DisplayNameUpdater'
import StatusSender, { IStatusSender } from './Services/Me/StatusSender'
import TextStatusUpdater, { ITextStatusUpdater } from './Services/Me/TextStatusUpdater'
import MessageMediaDownloader, { IMessageMediaDownloader } from './Services/Message/MessageMediaDownloader'
import Base64FileDownloader, { IBase64FileDownloader } from './Services/Response/Base64FIleDownloader'
import NumberValidator, { INumberValidator } from './Services/Contact/NumberValidator'

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
    // chat
    chatGetter: IChatGetter
    chatFinder: IChatFinder
    chatArchive: IChatArchive
    chatMute: IChatMute
    chatPin: IChatPin
    chatReader: IChatReader
    chatStateSender: IChatStateSender
    chatDeleter: IChatDeleter
    // message
    messageGetter: IMessageGetter
    messageFinder: IMessageFinder
    messageDeleter: IMessageDeleter
    messageReact: IMessageReact
    messageStar: IMessageStar
    messageMediaDownloader: IMessageMediaDownloader
    // Group Chat
    groupChatCreator: IGroupChatCreator
    groupChatFinder: IGroupChatFinder
    groupChatInvite: IGroupChatInvite
    groupChatUpdater: IGroupChatUpdater
    groupChatParticipant: IGroupParticipant
    // Contact
    contactFinder: IContactFinder
    contactGetter: IContactGetter
    contactBlock: IContactBlock
    numberValidator: INumberValidator
    // Me
    meDisplayNameUpdater: IDisplayNameUpdater
    meStatusSender: IStatusSender
    meTextStatusUpdater: ITextStatusUpdater
    // Response helpers
    base64FileDownloader: IBase64FileDownloader
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
        new MessageStar(messageFinder),

    messageMediaDownloader: ({ messageFinder, logger }) =>
        new MessageMediaDownloader(messageFinder, logger),

    groupChatCreator: ({ whatsapp }) =>
        new GroupChatCreator(whatsapp),

    groupChatFinder: ({ whatsapp }) =>
        new GroupChatFinder(whatsapp),

    groupChatInvite: ({ whatsapp, groupChatFinder }) =>
        new GroupChatInvite(whatsapp, groupChatFinder),

    groupChatUpdater: ({ groupChatFinder }) =>
        new GroupChatUpdater(groupChatFinder),

    groupChatParticipant: ({ groupChatFinder }) =>
        new GroupParticipant(groupChatFinder),

    contactFinder: ({ whatsapp }) =>
        new ContactFinder(whatsapp),

    contactGetter: ({ whatsapp }) =>
        new ContactGetter(whatsapp),

    contactBlock: ({ contactFinder }) =>
        new ContactBlock(contactFinder),

    meDisplayNameUpdater: ({ whatsapp }) =>
        new DisplayNameUpdater(whatsapp),

    meStatusSender: ({ whatsapp }) =>
        new StatusSender(whatsapp),

    meTextStatusUpdater: ({ whatsapp }) =>
        new TextStatusUpdater(whatsapp),

    base64FileDownloader: () =>
        new Base64FileDownloader(),

    numberValidator: ({ whatsapp }) =>
        new NumberValidator(whatsapp)
})
