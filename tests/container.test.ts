import { IEventPublisher } from './../src/Services/HomeAssistant/EventPublisher';
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
import { IHomeAssistant } from '../src/Libs/HomeAssistant';

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
        expect(items.HomeAssistant).toBeDefined()

        const typecheck: AssertTypeEqual < typeof items, {
            app: IHttpServer
            logger: ILogger
            eventBus: IEventBus
            whatsapp: IWhatsapp
            webServer: IWebServer
            webSocket: IWebSocket
            textMessageCreator: ITextMessageCreator
            mediaUrlMessageCreator: IMediaUrlMessageCreator,
            haEventPublisher: IEventPublisher,
            HomeAssistant: IHomeAssistant
        } > = true

        expect(typecheck).toBe(true)
    })
})
