import request from 'supertest'
import testServer from '../../utils/TestWebServer'

const mockStatusSender = {
    available: jest.fn().mockResolvedValue(null),
    unavailable: jest.fn().mockResolvedValue(null)
}

jest.mock('../../../src/Services/Me/StatusSender', () => {
    return jest.fn().mockImplementation(() => {
        return mockStatusSender
    })
})

const mockDisplayNameUpdater = {
    update: jest.fn().mockResolvedValue(null)
}

jest.mock('../../../src/Services/Me/DisplayNameUpdater', () => {
    return jest.fn().mockImplementation(() => {
        return mockDisplayNameUpdater
    })
})

const mockTextStatusUpdater = {
    update: jest.fn().mockResolvedValue(null)
}

jest.mock('../../../src/Services/Me/TextStatusUpdater', () => {
    return jest.fn().mockImplementation(() => {
        return mockTextStatusUpdater
    })
})

describe('MeController', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('send available status', async () => {
        await request(testServer.app)
            .put('/api/me/available')
            .expect(204)

        expect(mockStatusSender.available).toBeCalledTimes(1)
    })

    it('send unavailable status', async () => {
        await request(testServer.app)
            .put('/api/me/unavailable')
            .expect(204)

        expect(mockStatusSender.unavailable).toBeCalledTimes(1)
    })

    it('update display name', async () => {
        await request(testServer.app)
            .put('/api/me/display-name')
            .send({ name: 'John Doe' })
            .expect(204)

        expect(mockDisplayNameUpdater.update).toBeCalledTimes(1)
        expect(mockDisplayNameUpdater.update).toBeCalledWith('John Doe')
    })

    it('update text status', async () => {
        await request(testServer.app)
            .put('/api/me/text-status')
            .send({ status: 'Hello world' })
            .expect(204)

        expect(mockTextStatusUpdater.update).toBeCalledTimes(1)
        expect(mockTextStatusUpdater.update).toBeCalledWith('Hello world')
    })
})
