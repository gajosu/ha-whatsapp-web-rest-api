import request from 'supertest'
import testServer from '../../utils/TestWebServer'

const mockTextSender = jest.fn()

jest.mock('../../../src/Services/Message/TextMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockTextSender
        }
    })
})

const mockFileSender = jest.fn()

jest.mock('../../../src/Services/Message/MediaUrlMessageCreator', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: mockFileSender
        }
    })
})

describe('Express App', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('send text message', async () => {
        await request(testServer.app)
            .post('/api/messages')
            .send({
                to: '5511999999999',
                msg: 'Hello World'
            })
            .expect(200, { message: 'Message sent' })

        expect(mockTextSender).toBeCalledTimes(1)
    })

    it('send file message', async () => {
        await request(testServer.app)
            .post('/api/messages')
            .send({
                to: '5511999999999',
                url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
            })
            .expect(200, { message: 'Message sent' })

        expect(mockFileSender).toBeCalledTimes(1)
    })
})
