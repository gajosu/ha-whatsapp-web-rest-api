import mockLogger from './stubs/Logger'
import WebServer from '../src/Libs/WebServer'
import request from 'supertest'
import container from '../src/container'

jest.mock('../src/config/GlobalConfig', () => {
    return jest.fn().mockImplementation((key: string, defaultValue: any) => {
        return defaultValue
    })
})

const mockTextSender = jest.fn()

jest.mock('../src/Services/Message/TextMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockTextSender
        }
    })
})

const mockFileSender = jest.fn()

jest.mock('../src/Services/Message/MediaUrlMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockFileSender
        }
    })
})

const app = container.app.app
const webServer = new WebServer(app, mockLogger)
webServer.start()

describe('Express App', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('send text message', async () => {
        // overrride whatsapp client in container
        container.whatsapp.getClient = jest.fn().mockImplementation(() => {
            return {
                getState: jest.fn().mockResolvedValue('CONNECTED')
            }
        })

        await request(app)
            .post('/api/messages')
            .send({
                to: '5511999999999',
                msg: 'Hello World'
            })
            .expect(200, { message: 'Message sent' })

        expect(mockTextSender).toBeCalledTimes(1)
    })

    it('send file message', async () => {
        // overrride whatsapp client in container
        container.whatsapp.getClient = jest.fn().mockImplementation(() => {
            return {
                getState: jest.fn().mockResolvedValue('CONNECTED')
            }
        })

        await request(app)
            .post('/api/messages')
            .send({
                to: '5511999999999',
                url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
            })
            .expect(200, { message: 'Message sent' })

        expect(mockFileSender).toBeCalledTimes(1)
    })
})
