import { IMessageDeleter } from './../src/Services/Message/MessageDeleter'
import { IChatDeleter } from './../src/Services/Chat/ChatDeleter'
import { IChatStateSender } from './../src/Services/Chat/ChatStateSender'
import { IChatReader } from './../src/Services/Chat/ChatReader'
import { IChatPin } from './../src/Services/Chat/ChatPin'
import { IChatMute } from './../src/Services/Chat/ChatMute'
import { IChatArchive } from './../src/Services/Chat/ChatArchive'
import { IChatFinder } from './../src/Services/Chat/ChatFinder'
import { IEventPublisher } from './../src/Services/HomeAssistant/EventPublisher'
import { IHttpServer } from './../src/config/HttpServer'
import { IMediaUrlMessageCreator } from './../src/Services/Message/MediaUrlMessageCreator'
import { ITextMessageCreator } from './../src/Services/Message/TextMessageCreator'
import { IWebSocket } from './../src/Libs/WebSocket'
import { ILogger } from './../src/Libs/Logger'
import { prepareAll, releaseAll } from 'true-di'
import container from '../src/container'
import { IEventBus } from '../src/Libs/EventBus'
import { IWhatsapp } from '../src/Libs/Whatsapp'
import { IWebServer } from '../src/Libs/WebServer'
import { IHomeAssistant } from '../src/Libs/HomeAssistant'
import { IChatGetter } from '../src/Services/Chat/ChatGetter'
import { IMessageGetter } from '../src/Services/Message/MessageGetter'
import { IMessageFinder } from '../src/Services/Message/MessageFinder'
import { IMessageStar } from '../src/Services/Message/MessageStar'
import { IMessageReact } from '../src/Services/Message/MessageReact'
import { IGroupChatCreator } from '../src/Services/GroupChat/GroupChatCreator'
import { IGroupChatFinder } from '../src/Services/GroupChat/GroupChatFinder'
import { IGroupChatInvite } from '../src/Services/GroupChat/GroupChatInvite'
import { IGroupChatUpdater } from '../src/Services/GroupChat/GroupChatUpdater'
import { IContactFinder } from '../src/Services/Contact/ContactFinder'
import { IContactGetter } from '../src/Services/Contact/ContactGetter'
import { IContactBlock } from '../src/Services/Contact/ContactBlock'
import { IDisplayNameUpdater } from '../src/Services/Me/DisplayNameUpdater'
import { IStatusSender } from '../src/Services/Me/StatusSender'
import { ITextStatusUpdater } from '../src/Services/Me/TextStatusUpdater'
import { IGroupParticipant } from '../src/Services/GroupChat/GroupParticipant'

jest.mock('../src/config/HttpServer', () => {
    return {
        getHttpServer: () => ({
            app: {
                get: jest.fn(),
                use: jest.fn(),
                post: jest.fn(),
                put: jest.fn(),
                delete: jest.fn(),
                listen: jest.fn()
            },
            server: {
                listen: jest.fn()
            }
        })
    }
})

type AssertTypeEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : never) : never

describe('container', () => {
    afterEach(() => {
        releaseAll(container)
    })

    it('allows to instantiate all items (prepareAll)', () => {
        const items = prepareAll(container)

        expect(items.app).toBeDefined()
        expect(items.logger).toBeDefined()
        expect(items.eventBus).toBeDefined()
        expect(items.whatsapp).toBeDefined()
        expect(items.webServer).toBeDefined()
        expect(items.webSocket).toBeDefined()
        expect(items.textMessageCreator).toBeDefined()
        expect(items.mediaUrlMessageCreator).toBeDefined()
        expect(items.haEventPublisher).toBeDefined()
        expect(items.homeAssistant).toBeDefined()

        // chat services
        expect(items.chatGetter).toBeDefined()
        expect(items.chatFinder).toBeDefined()
        expect(items.chatArchive).toBeDefined()
        expect(items.chatMute).toBeDefined()
        expect(items.chatPin).toBeDefined()
        expect(items.chatReader).toBeDefined()
        expect(items.chatStateSender).toBeDefined()
        expect(items.chatDeleter).toBeDefined()

        // message services
        expect(items.messageGetter).toBeDefined()
        expect(items.messageFinder).toBeDefined()
        expect(items.messageStar).toBeDefined()
        expect(items.messageReact).toBeDefined()
        expect(items.messageDeleter).toBeDefined()

        // group chat
        expect(items.groupChatCreator).toBeDefined()
        expect(items.groupChatFinder).toBeDefined()
        expect(items.groupChatInvite).toBeDefined()
        expect(items.groupChatUpdater).toBeDefined()
        expect(items.groupChatParticipant).toBeDefined()

        // contact
        expect(items.contactFinder).toBeDefined()
        expect(items.contactGetter).toBeDefined()
        expect(items.contactBlock).toBeDefined()

        // me
        expect(items.meDisplayNameUpdater).toBeDefined()
        expect(items.meStatusSender).toBeDefined()
        expect(items.meTextStatusUpdater).toBeDefined()

        const typecheck: AssertTypeEqual < typeof items, {
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
            messageStar: IMessageStar
            messageReact: IMessageReact
            messageDeleter: IMessageDeleter

            groupChatCreator: IGroupChatCreator
            groupChatFinder: IGroupChatFinder
            groupChatInvite: IGroupChatInvite
            groupChatUpdater: IGroupChatUpdater
            groupChatParticipant: IGroupParticipant

            contactFinder: IContactFinder
            contactGetter: IContactGetter
            contactBlock: IContactBlock

            meDisplayNameUpdater: IDisplayNameUpdater
            meStatusSender: IStatusSender
            meTextStatusUpdater: ITextStatusUpdater
        } > = true

        expect(typecheck).toBe(true)
    })
})
