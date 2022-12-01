import request from 'supertest'
import testServer from '../../utils/TestWebServer'

describe('ServiceStatus', () => {
    afterAll(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('get service status', async () => {
        testServer.container.whatsapp.getClient = jest.fn().mockImplementation(() => {
            return {
                getState: jest.fn().mockResolvedValue('CONNECTED')
            }
        })

        await request(testServer.app)
            .get('/api/status')
            .expect(200, { status: 'CONNECTED' })
    })

    it('return INITIALIZING when whatsapp is not initialized', async () => {
        testServer.container.whatsapp.getClient = jest.fn().mockImplementation(() => {
            return {
                getState: jest.fn().mockResolvedValue(null)
            }
        })

        await request(testServer.app)
            .get('/api/status')
            .expect(200, { status: 'INITIALIZING' })
    })
})
