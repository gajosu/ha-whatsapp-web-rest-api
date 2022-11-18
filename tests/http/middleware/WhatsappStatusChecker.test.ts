import mockLogger from '..//../stubs/Logger'
import Express from 'express'
import statusChecker from '../../../src/http/middlewares/WhatsappStatusChecker'

function returnThis (): any { return this }

const fakeResponse = (): Express.Response => ({
    status: jest.fn(returnThis),
    json: jest.fn(returnThis)
}) as any

beforeEach(() => {
    jest.clearAllMocks()
})

describe('WhatsappStatusChecker.test', () => {
    it('whatsapp is not connected', async () => {
        const res = fakeResponse()
        const next = jest.fn()
        const whatsapp = {
            start: jest.fn(),
            stop: jest.fn(),
            getClient: jest.fn().mockReturnValue({
                getState: jest.fn().mockResolvedValue('DISCONNECTED')
            })
        }

        await statusChecker({} as any, res, next)({ logger: mockLogger, whatsapp })

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(503)
        expect(res.json).toHaveBeenCalledWith({ message: 'Whatsapp is not connected', status: 503 })
        expect(mockLogger.error).toHaveBeenCalledWith('Whatsapp is not connected')
    })

    it('whatsapp is connected', async () => {
        const res = fakeResponse()
        const next = jest.fn()
        const whatsapp = {
            start: jest.fn(),
            stop: jest.fn(),
            getClient: jest.fn().mockReturnValue({
                getState: jest.fn().mockResolvedValue('CONNECTED')
            })
        }

        await statusChecker({} as any, res, next)({ logger: mockLogger, whatsapp })

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(mockLogger.error).not.toHaveBeenCalled()
    })

    it('thows error', async () => {
        const res = fakeResponse()
        const next = jest.fn()
        const whatsapp = {
            start: jest.fn(),
            stop: jest.fn(),
            getClient: jest.fn().mockReturnValue({
                getState: jest.fn().mockRejectedValue(new Error('error'))
            })
        }

        await statusChecker({} as any, res, next)({ logger: mockLogger, whatsapp })

        expect(next).toHaveBeenCalledWith(new Error('error'))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(mockLogger.error).not.toHaveBeenCalled()
    })
})
